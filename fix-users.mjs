import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Upserting mock users...");
  
  await prisma.user.upsert({
    where: { email: 'everett@foreverflorida.com' },
    update: {},
    create: {
      id: 'user_admin123',
      name: 'Everett Admin',
      email: 'everett@foreverflorida.com',
      role: 'admin',
      status: 'active'
    }
  });

  await prisma.user.upsert({
    where: { email: 'smith@agent.com' },
    update: {},
    create: {
      id: 'user_agent456',
      name: 'Agent Smith',
      email: 'smith@agent.com',
      role: 'agent',
      status: 'active'
    }
  });

  console.log("Mock users created successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
