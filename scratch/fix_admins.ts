import { prisma } from '../src/lib/db';

async function main() {
  const result = await prisma.user.updateMany({
    where: { role: 'admin' },
    data: { status: 'active' }
  });
  console.log("Updated admins:", result.count);
}
main().catch(console.error);
