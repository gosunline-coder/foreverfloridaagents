import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'agent' }
  });
  console.log(users.map(u => ({ id: u.id, name: u.name, driversLicense: u.driversLicense, autoInsurance: u.autoInsurance })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
