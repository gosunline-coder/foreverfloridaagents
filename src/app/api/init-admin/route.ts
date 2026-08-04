import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Extremely secure: requires the Clerk Secret Key to execute
  if (secret !== process.env.CLERK_SECRET_KEY) { 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.user.upsert({
      where: { email: 'gosunline@gmail.com' },
      update: { role: 'superadmin', status: 'active' },
      create: {
        id: 'usr_' + Date.now().toString(),
        email: 'gosunline@gmail.com',
        name: 'Erik Papp',
        role: 'superadmin',
        status: 'active'
      }
    });

    return NextResponse.json({ success: true, message: 'gosunline@gmail.com has been made an admin!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
