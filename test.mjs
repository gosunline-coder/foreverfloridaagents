import { PrismaClient } from '@prisma/client/default.js'

const prisma = new PrismaClient()

async function main() {
  try {
    const existingRequests = await prisma.supplyRequest.findMany({
      where: { status: { not: 'returned' } }
    });
    console.log('Success', existingRequests.length)
  } catch (err) {
    console.error('Error occurred:', err)
  }
}

main()
