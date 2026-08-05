import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  if (!url.includes('.blob.vercel-storage.com')) {
    return new NextResponse('Invalid document URL', { status: 400 });
  }

  try {
    const result = await get(url, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result) {
      return new NextResponse('Document not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', result.blob.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'private, max-age=3600');
    headers.set('Content-Disposition', 'inline');

    return new NextResponse(result.stream as unknown as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error fetching private document:', error);
    return new NextResponse(`Failed to fetch document: ${error.message}`, { status: 500 });
  }
}
