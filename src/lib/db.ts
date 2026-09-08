import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  let url = process.env.ACCELERATE_URL;
  let source = 'ACCELERATE_URL';

  if (!url) {
    url = process.env.PRISMA_DATABASE_URL;
    source = 'PRISMA_DATABASE_URL';
  }
  if (!url) {
    url = process.env.POSTGRES_PRISMA_URL;
    source = 'POSTGRES_PRISMA_URL';
  }
  if (!url) {
    url = process.env.DATABASE_URL;
    source = 'DATABASE_URL';
  }

  if (!url) {
    throw new Error('Prisma initialization failed: ACCELERATE_URL, PRISMA_DATABASE_URL, POSTGRES_PRISMA_URL, and DATABASE_URL are all undefined or empty.');
  }

  console.log(`Prisma client initialized using ${source}`);

  return new PrismaClient({
    accelerateUrl: url
  }).$extends(withAccelerate())
}

const globalForPrisma = globalThis as unknown as {
  _prisma?: ReturnType<typeof prismaClientSingleton>
}

// Proxy defers client initialization until the first method call
export const prisma = new Proxy({} as ReturnType<typeof prismaClientSingleton>, {
  get(target, prop, receiver) {
    if (!globalForPrisma._prisma) {
      globalForPrisma._prisma = prismaClientSingleton();
    }
    const value = Reflect.get(globalForPrisma._prisma, prop, receiver);
    // Bind functions to the actual instance so `this` context is preserved
    return typeof value === 'function' ? value.bind(globalForPrisma._prisma) : value;
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma._prisma = globalForPrisma._prisma
