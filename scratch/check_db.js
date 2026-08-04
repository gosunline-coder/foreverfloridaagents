const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ where: { role: 'agent' } });
  console.log(users.map(u => ({ id: u.id, name: u.name, dl: u.driversLicense, ins: u.autoInsurance })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
