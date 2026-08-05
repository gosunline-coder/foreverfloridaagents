import { config } from 'dotenv';
config(); // Load .env
import { prisma } from '../src/lib/db';

async function main() {
  const email = 'propknocks@gmail.com';
  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { role: 'admin', status: 'active' }
    });
    console.log('Updated existing user:', user);
  } else {
    user = await prisma.user.create({
      data: {
        email,
        name: 'Ryan Hartman',
        role: 'admin',
        status: 'active'
      }
    });
    console.log('Created new user:', user);
  }
}

main().catch(console.error);
