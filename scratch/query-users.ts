import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const { prisma } = await import('../src/lib/db');
  const users = await prisma.user.findMany({
    select: {
      email: true,
      clerkId: true,
      role: true,
      status: true
    }
  });
  console.table(users);
  await prisma.$disconnect();
}

main().catch(console.error);
