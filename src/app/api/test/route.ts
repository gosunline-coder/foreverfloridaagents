import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { role: 'agent' } });
    const catalog = await prisma.inventoryCatalog.findFirst();

    if (!user || !catalog) {
      return NextResponse.json({ error: 'Missing user or catalog' });
    }

    const existingRequests = await prisma.supplyRequest.findMany({
      where: { userId: user.id, itemType: catalog.name, status: { not: 'returned' } }
    });

    return NextResponse.json({ success: true, count: existingRequests.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
