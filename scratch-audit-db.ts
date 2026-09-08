import 'dotenv/config';
import { prisma } from './src/lib/db';

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { email: true, clerkId: true, role: true, status: true, archivedAt: true }
    });
    console.log("USERS TABLE:");
    console.table(users);

    const auditLogs = await prisma.auditLog.findMany();
    console.log("AUDIT LOG TABLE:");
    console.table(auditLogs);
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
