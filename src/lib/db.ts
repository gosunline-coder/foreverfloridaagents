import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import path from 'path';
import fs from 'fs';

let dbUrl = 'file:' + path.join(process.cwd(), 'dev.db');

// Vercel serverless functions have a read-only filesystem except for /tmp.
// SQLite needs to write a journal file, so we must copy it to /tmp to avoid a crash.
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    const originalDbPath = path.join(process.cwd(), 'dev.db');
    if (fs.existsSync(originalDbPath)) {
      fs.copyFileSync(originalDbPath, tmpDbPath);
    }
  }
  dbUrl = 'file:' + tmpDbPath;
}

const libsql = createClient({
  url: dbUrl,
})

// @ts-ignore
const adapter = new PrismaLibSql(libsql)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// @ts-ignore
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
