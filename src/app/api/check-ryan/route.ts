import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'propknocks', mode: 'insensitive' } },
        { name: { contains: 'Ryan', mode: 'insensitive' } }
      ]
    }
  });

  return NextResponse.json(users);
}
