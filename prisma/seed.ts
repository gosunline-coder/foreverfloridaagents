import { prisma } from '../src/lib/db';

async function main() {
  console.log('Cleaning up existing seeded data...');
  const seededEmails = [
    'mid@example.com',
    'stalled@example.com',
    'complete@example.com',
    'departed@example.com',
    'admin@example.com'
  ];

  const seededUsers = await prisma.user.findMany({ where: { email: { in: seededEmails } } });
  const userIds = seededUsers.map(u => u.id);
  
  // Clean up relations first since they don't have onDelete: Cascade
  await prisma.completion.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.supplyRequest.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });

  // Clean up seeded modules
  const seededModules = ['Welcome to Forever Florida', 'Matrix & MLS Basics'];
  const modules = await prisma.trainingModule.findMany({ where: { title: { in: seededModules } } });
  const moduleIds = modules.map(m => m.id);
  await prisma.completion.deleteMany({ where: { moduleId: { in: moduleIds } } });
  await prisma.trainingModule.deleteMany({ where: { id: { in: moduleIds } } });


  console.log('Seeding Inventory Catalog...');
  await prisma.inventoryCatalog.createMany({
    data: [
      { name: 'Yard Sign', cost: 45.0, maxPerAgent: 10, totalStock: 100, isReturnable: true, isActive: true },
      { name: 'Lockbox', cost: 25.0, maxPerAgent: 5, totalStock: 50, isReturnable: true, isActive: true },
      { name: 'Business Cards', cost: 15.0, maxPerAgent: 1, totalStock: 500, isReturnable: false, isActive: true },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding Training Modules...');
  const module1 = await prisma.trainingModule.create({
    data: {
      title: 'Welcome to Forever Florida',
      videoUrl: 'https://example.com/welcome.mp4',
      sequenceStage: 'day1',
      requiresAck: true,
    }
  });

  const module2 = await prisma.trainingModule.create({
    data: {
      title: 'Matrix & MLS Basics',
      videoUrl: 'https://example.com/matrix.mp4',
      sequenceStage: 'week1',
      requiresAck: false,
    }
  });

  console.log('Seeding Agents...');
  
  // 1. Mid-onboarding (status 'invited', clerkId is null since they haven't finished onboarding yet)
  await prisma.user.create({
    data: {
      clerkId: null, // explicit null
      name: 'Mid Onboarding Agent',
      email: 'mid@example.com',
      role: 'agent',
      status: 'invited',
      inviteToken: 'invite-mid-123',
    }
  });

  // 2. Stalled (status 'active', no activity)
  await prisma.user.create({
    data: {
      clerkId: 'seed_stalled',
      name: 'Stalled Agent',
      email: 'stalled@example.com',
      role: 'agent',
      status: 'active',
      licenseNumber: 'SL1234567',
    }
  });

  // 3. Fully Complete
  const completeAgent = await prisma.user.create({
    data: {
      clerkId: 'seed_complete',
      name: 'Complete Agent',
      email: 'complete@example.com',
      role: 'agent',
      status: 'active',
      licenseNumber: 'SL9999999',
      mlsNumber: 'MLS123',
      zillowProfile: true,
      realtorProfile: true,
    }
  });

  await prisma.completion.createMany({
    data: [
      { userId: completeAgent.id, moduleId: module1.id },
      { userId: completeAgent.id, moduleId: module2.id },
    ]
  });

  await prisma.supplyRequest.create({
    data: {
      userId: completeAgent.id,
      itemType: 'Yard Sign',
      quantity: 2,
      status: 'fulfilled',
      propertyAddress: '123 Palm Ave',
    }
  });

  // 4. Departed (with history)
  const departedAgent = await prisma.user.create({
    data: {
      clerkId: 'seed_departed',
      name: 'Departed Agent',
      email: 'departed@example.com',
      role: 'agent',
      status: 'departed',
      licenseNumber: 'SL4444444',
      mlsNumber: 'MLS456',
    }
  });

  await prisma.completion.create({
    data: { userId: departedAgent.id, moduleId: module1.id }
  });

  await prisma.supplyRequest.create({
    data: {
      userId: departedAgent.id,
      itemType: 'Lockbox',
      quantity: 1,
      status: 'returned',
      propertyAddress: '999 Ocean Drive',
      returnedAt: new Date(),
    }
  });

  // 5. Admin
  await prisma.user.create({
    data: {
      clerkId: 'seed_admin',
      name: 'Demo Admin',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
    }
  });

  console.log('Seeding Complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
