const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const returnedRequests = await prisma.supplyRequest.findMany({
    where: { status: 'returned', returnedAt: null }
  });
  
  for (const req of returnedRequests) {
    await prisma.supplyRequest.update({
      where: { id: req.id },
      data: { returnedAt: req.requestedAt }
    });
    console.log(`Updated request ${req.id}`);
  }
}

fix().catch(console.error).finally(() => prisma.$disconnect());
