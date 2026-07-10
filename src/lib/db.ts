import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: 'file:./dev.db',
})

// @ts-ignore
const adapter = new PrismaLibSql(libsql)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// @ts-ignore
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
