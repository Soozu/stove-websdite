import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.activity.deleteMany()
  await prisma.license.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding database...')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.disconnect()
  }) 