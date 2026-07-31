import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing existing training modules and documents...");
  await prisma.completion.deleteMany();
  await prisma.docAck.deleteMany();
  await prisma.trainingModule.deleteMany();
  await prisma.document.deleteMany();

  console.log("Seeding Training Modules...");
  const modules = [
    { title: "Welcome to Forever Florida", videoUrl: "https://example.com/video1.mp4", sequenceStage: "day1", requiresAck: false },
    { title: "Setting up your Tools", videoUrl: "https://example.com/video2.mp4", sequenceStage: "day1", requiresAck: false },
    { title: "Brokerage Policy Acknowledgment", videoUrl: "https://example.com/video3.mp4", sequenceStage: "day1", requiresAck: true },
    { title: "BoldTrail CRM Basics", videoUrl: "https://example.com/video4.mp4", sequenceStage: "week1", requiresAck: false },
    { title: "The Perfect Listing Presentation", videoUrl: "https://example.com/video5.mp4", sequenceStage: "week1", requiresAck: false },
    { title: "Automating your Marketing", videoUrl: "https://example.com/video6.mp4", sequenceStage: "month1", requiresAck: false },
    { title: "Building your Farm Area", videoUrl: "https://example.com/video7.mp4", sequenceStage: "month1", requiresAck: false },
  ];

  for (const m of modules) {
    await prisma.trainingModule.create({ data: m });
  }

  console.log("Seeding Documents...");
  const documents = [
    { title: "Independent Contractor Agreement", category: "Legal", fileUrl: "https://example.com/doc1.pdf", requiresAck: true },
    { title: "Forever Florida Office Policies v2", category: "Policy", fileUrl: "https://example.com/doc2.pdf", requiresAck: true },
    { title: "Exclusive Right of Sale Listing Agreement", category: "Forms", fileUrl: "https://example.com/doc3.pdf", requiresAck: false },
    { title: "Lead-Based Paint Disclosure", category: "Disclosures", fileUrl: "https://example.com/doc4.pdf", requiresAck: false },
    { title: "Wire Fraud Advisory", category: "Disclosures", fileUrl: "https://example.com/doc5.pdf", requiresAck: true },
  ];

  for (const d of documents) {
    await prisma.document.create({ 
      data: {
        title: d.title,
        category: d.category,
        fileUrl: d.fileUrl,
        requiresAck: d.requiresAck,
        version: 1
      }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
