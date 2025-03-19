import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createLicense(userId: string, type: 'SEVEN_DAYS' | 'THIRTY_DAYS' | 'ONE_YEAR') {
  const durations = {
    SEVEN_DAYS: 7,
    THIRTY_DAYS: 30,
    ONE_YEAR: 365,
  }

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + durations[type])

  return await prisma.license.create({
    data: {
      key: generateLicenseKey(),
      userId,
      type,
      endDate,
      status: 'ACTIVE',
    },
    include: {
      user: true,
    },
  })
}

export async function validateLicense(licenseKey: string, userId: string, ipAddress?: string, deviceInfo?: string) {
  const license = await prisma.license.findUnique({
    where: { key: licenseKey },
    include: { user: true },
  })

  const status = getLicenseStatus(license)

  await prisma.activity.create({
    data: {
      userId,
      licenseId: license?.id || '',
      action: 'VALIDATE',
      status: status === 'ACTIVE' ? 'SUCCESS' : 'FAILED',
      ipAddress,
      deviceInfo,
    },
  })

  return { isValid: status === 'ACTIVE', license }
}

export async function getLicenseHistory(licenseId: string) {
  return await prisma.activity.findMany({
    where: { licenseId },
    include: {
      user: true,
      license: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Helper functions
function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segments = 4
  const segmentLength = 4
  const parts: string[] = []

  for (let i = 0; i < segments; i++) {
    let segment = ''
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    parts.push(segment)
  }

  return parts.join('-')
}

function getLicenseStatus(license: any) {
  if (!license) return 'EXPIRED'
  if (license.status !== 'ACTIVE') return license.status
  if (new Date() > new Date(license.endDate)) return 'EXPIRED'
  return 'ACTIVE'
} 