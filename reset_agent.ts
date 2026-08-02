import { config } from 'dotenv';
config();
import { prisma } from './src/lib/db';

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users.map(u => ({ id: u.id, name: u.name, email: u.email, status: u.status })));

  const gosunlineUser = users.find(u => u.email.includes("gosunline.com"));
  if (gosunlineUser) {
    // Delete associated completions and acks first to avoid foreign key constraints
    await prisma.completion.deleteMany({ where: { userId: gosunlineUser.id } });
    await prisma.docAck.deleteMany({ where: { userId: gosunlineUser.id } });
    await prisma.user.delete({ where: { id: gosunlineUser.id } });
    console.log("Deleted gosunline user.");
  }

  const smithUser = users.find(u => u.name.includes("Smith"));
  if (smithUser) {
    await prisma.completion.deleteMany({ where: { userId: smithUser.id } });
    console.log("Deleted Completions for Agent Smith.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
