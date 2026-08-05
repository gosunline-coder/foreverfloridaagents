import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const secret = searchParams.get('secret');

  // Simple secret to prevent abuse
  if (secret !== 'erik123') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!email) {
    return new NextResponse('Email required', { status: 400 });
  }

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'admin', status: 'active' },
      create: { 
        email, 
        name: email.split('@')[0], 
        role: 'admin', 
        status: 'active' 
      }
    });

    return new NextResponse(`Success! ${user.email} is now a super admin.`);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
