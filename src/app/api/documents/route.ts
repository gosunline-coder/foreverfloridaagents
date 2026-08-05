import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // Basic security check: ensure it's a Vercel Blob URL
  if (!url.includes('.blob.vercel-storage.com')) {
    return new NextResponse('Invalid document URL', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch document', { status: response.status });
    }

    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Cache-Control', 'private, max-age=3600');
    // Force inline display if possible so PDFs and images open in the browser
    headers.set('Content-Disposition', 'inline');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching private document:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
