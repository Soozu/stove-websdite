import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { duration } = req.body
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'

    // Convert duration string to days and set cooldown
    let duration_days = 0
    let cooldown_days = 0
    if (duration === "7 Days") {
      duration_days = 7
      cooldown_days = 14
    } else if (duration === "15 Days") {
      duration_days = 15
      cooldown_days = 15
    } else if (duration === "30 Days") {
      duration_days = 30
      cooldown_days = 30
    }

    if (!process.env.LICENSE_SERVER_API_KEY) {
      throw new Error('License server API key not configured')
    }

    console.log('Making request to license server with:', {
      duration_days,
      cooldown_days,
      clientIp
    })

    // Generate license directly (we'll handle cooldown on the server side)
    const response = await fetch('https://stoveserver-production.up.railway.app/api/generate_license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.LICENSE_SERVER_API_KEY
      },
      body: JSON.stringify({
        user_id: clientIp,
        duration: duration_days,
        cooldown: cooldown_days
      })
    })

    const responseText = await response.text()
    console.log('License server response:', responseText)

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(400).json({
          canAccess: false,
          message: 'Please wait before generating another license'
        })
      }
      
      return res.status(400).json({
        canAccess: false,
        message: `License server error: ${responseText}`
      })
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse license server response:', e)
      throw new Error('Invalid response from license server')
    }

    // Check if we have a license key in the response
    if (!data.success || !data.license_data?.license_key) {
      console.error('No license key in response:', data)
      throw new Error('No license key in response')
    }

    return res.status(200).json({
      canAccess: true,
      license: {
        license_key: data.license_data.license_key,
        expires_at: data.license_data.expiry_date || null
      }
    })

  } catch (error) {
    console.error('Error generating license:', error)
    return res.status(500).json({ 
      canAccess: false,
      message: error instanceof Error ? error.message : 'Failed to generate license. Please try again later.'
    })
  }
} 