/**
 * Note: This script unconditionally overwrites roles for the provided emails. 
 * It is intended for initial provisioning and reset only, not routine role management.
 */
import { config } from 'dotenv';
config();

async function processEmails(emailsEnv: string | undefined, role: string) {
  if (!emailsEnv) return;
  const emails = emailsEnv.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  
  const { prisma } = await import('../src/lib/db');

  for (const email of emails) {
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role,
          status: 'active',
        },
      });
      console.log(`Updated existing user to ${role}: ${existingUser.email}`);
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          role,
          status: 'active',
          inviteToken: null,
        }
      });
      console.log(`Created new ${role}: ${newUser.email}`);
    }
  }
}

async function main() {
  await processEmails(process.env.SUPERADMIN_EMAILS, 'superadmin');
  await processEmails(process.env.ADMIN_EMAILS, 'admin');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import('../src/lib/db');
    await prisma.$disconnect();
  });
