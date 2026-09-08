import 'dotenv/config';
import { prisma } from './src/lib/db';

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { email: true, clerkId: true, role: true, status: true, archivedAt: true }
    });
    console.table(users);
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
