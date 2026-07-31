import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fixing Vidyard URL format...");
  
  const modules = await prisma.trainingModule.findMany({
    orderBy: { title: 'asc' }
  });

  if (modules.length > 0) {
    const firstModuleId = modules[0].id;
    await prisma.trainingModule.update({
      where: { id: firstModuleId },
      data: { videoUrl: "https://play.vidyard.com/Y6fUXeju2f5XjWWpDwesfK" }
    });
    console.log(`Updated module "${modules[0].title}" with the correct play.vidyard.com link!`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
