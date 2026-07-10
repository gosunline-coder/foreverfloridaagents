import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: 'file:./dev.db',
})
// Try printing what PrismaLibSql expects
console.log("TEST")
