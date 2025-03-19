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

    // Generate license directly (we'll handle cooldown on the server side)
    const response = await fetch('https://stoveserver-production.up.railway.app/api/generate_license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.LICENSE_SERVER_API_KEY
      },
      body: JSON.stringify({
        identifier: clientIp,
        duration: duration_days,
        cooldown: cooldown_days,
        type: duration
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('License server error:', errorText)
      
      if (response.status === 429) {
        return res.status(400).json({
          canAccess: false,
          message: 'Please wait before generating another license'
        })
      }
      
      throw new Error('Failed to generate license')
    }

    const data = await response.json()

    // Check if we have a license key in the response
    if (!data.license_key && !data.key) {
      throw new Error('No license key in response')
    }

    return res.status(200).json({
      canAccess: true,
      license: {
        license_key: data.license_key || data.key,
        expires_at: data.expires_at || null
      }
    })

  } catch (error) {
    console.error('Error generating license:', error)
    return res.status(500).json({ 
      canAccess: false,
      message: 'Failed to generate license. Please try again later.' 
    })
  }
} 