import { prisma } from './src/lib/db'

async function main() {
  const count = await prisma.inquiry.count()
  if (count > 0) {
    console.log("Inquiries already exist, skipping seed.");
    return;
  }

  await prisma.inquiry.createMany({
    data: [
      {
        name: "Alice Waters",
        email: "alice@example.com",
        phone: "(727) 555-9876",
        currentBrokerage: "Sunshine Realty",
        message: "Looking for better support and splits.",
        status: "New",
      },
      {
        name: "Bob Harris",
        email: "bob@example.com",
        phone: "(813) 555-4321",
        currentBrokerage: "Gulf Coast Properties",
        message: "Interested in the tools you provide. Can we schedule a quick call?",
        status: "Contacted",
        notes: "Called Bob on Tuesday. He's very interested in BoldTrail. Follow up next week.",
      },
      {
        name: "Sarah Jenkins",
        email: "s.jenkins@test.com",
        phone: "(941) 555-0100",
        currentBrokerage: "None (Newly Licensed)",
        message: "I just passed my exam and am looking for a brokerage with good mentorship.",
        status: "Interviewing",
        notes: "Great energy. Needs lots of handholding initially but has a huge SOI.",
      }
    ]
  })

  console.log("Seeded mock inquiries.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
