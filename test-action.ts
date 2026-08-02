import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.findFirst({ where: { role: 'agent' } })
    const catalog = await prisma.inventoryCatalog.findFirst()
    
    if (!user || !catalog) {
      console.log('No user or catalog found')
      return
    }

    console.log(`Testing with user ${user.id} and catalog item ${catalog.id} (${catalog.name})`)

    const existingRequests = await prisma.supplyRequest.findMany({
      where: { userId: user.id, itemType: catalog.name, status: { not: 'returned' } }
    });
    
    console.log('existing requests:', existingRequests.length)

    const req = await prisma.supplyRequest.create({
      data: {
        userId: user.id,
        itemType: catalog.name,
        quantity: 1,
        propertyAddress: "123 Test St",
      }
    });

    console.log('Created request successfully', req)
  } catch (err) {
    console.error('Error occurred:', err)
  }
}

main()
