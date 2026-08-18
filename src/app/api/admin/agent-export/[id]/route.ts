import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const caller = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!caller || (caller.role !== 'admin' && caller.role !== 'superadmin')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { id: agentId } = await context.params;
  const agent = await prisma.user.findUnique({
    where: { id: agentId },
    include: {
      completions: { include: { module: true } },
      docAcks: { include: { document: true } }
    }
  });

  if (!agent) return new NextResponse('Agent not found', { status: 404 });

  // 1. Create PDF
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const drawText = (page: any, text: string, x: number, y: number, font = timesRomanFont, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
  };

  // Create cover page
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let cursorY = height - 50;

  const title = `Forever Florida Real Estate - Agent Record`;
  drawText(page, title, 50, cursorY, timesRomanBold, 18);
  cursorY -= 25;
  drawText(page, "Generated from Forever Florida Agent Portal. This document is a point-in-time record.", 50, cursorY, timesRomanFont, 10);
  cursorY -= 30;

  // Profile data
  const dataPairs = [
    ["Name", agent.name],
    ["Email", agent.email],
    ["Phone", agent.phone || 'N/A'],
    ["Address", [agent.address, agent.city, agent.state, agent.zip].filter(Boolean).join(', ') || 'N/A'],
    ["Real Estate License Number", agent.licenseNumber || 'N/A'],
    ["License Status", agent.licenseStatus || 'N/A'],
    ["License Expiration", agent.licenseExpiration ? new Date(agent.licenseExpiration).toLocaleDateString() : 'N/A'],
    ["MLS ID", agent.mlsNumber || 'N/A'],
    ["Onboarding Status", agent.status],
    ["Start Date", new Date(agent.hireDate).toLocaleDateString()],
  ];

  for (const [key, val] of dataPairs) {
    drawText(page, `${key}:`, 50, cursorY, timesRomanBold, 12);
    drawText(page, val as string, 220, cursorY, timesRomanFont, 12);
    cursorY -= 20;
  }

  cursorY -= 20;
  drawText(page, "Training Completions", 50, cursorY, timesRomanBold, 14);
  cursorY -= 20;
  if (agent.completions.length === 0) {
    drawText(page, "None", 50, cursorY, timesRomanFont, 12);
    cursorY -= 20;
  } else {
    for (const c of agent.completions) {
      if (cursorY < 50) { page = pdfDoc.addPage(); cursorY = height - 50; }
      drawText(page, `- ${c.module?.title || 'Unknown Module'} (Completed: ${new Date(c.completedAt).toLocaleDateString()})`, 50, cursorY, timesRomanFont, 12);
      cursorY -= 20;
    }
  }

  cursorY -= 10;
  if (cursorY < 80) { page = pdfDoc.addPage(); cursorY = height - 50; }
  drawText(page, "Policy Acknowledgments", 50, cursorY, timesRomanBold, 14);
  cursorY -= 20;
  if (agent.docAcks.length === 0) {
    drawText(page, "None", 50, cursorY, timesRomanFont, 12);
    cursorY -= 20;
  } else {
    for (const ack of agent.docAcks) {
      if (cursorY < 50) { page = pdfDoc.addPage(); cursorY = height - 50; }
      drawText(page, `- ${ack.document?.title || 'Unknown Document'} (Ack'd: ${new Date(ack.ackedAt).toLocaleDateString()})`, 50, cursorY, timesRomanFont, 12);
      cursorY -= 20;
    }
  }

  const processDocument = async (docUrl: string | null, docType: string) => {
    if (!docUrl) {
      const p = pdfDoc.addPage();
      p.drawText(`${docType}`, { x: 50, y: height - 50, size: 16, font: timesRomanBold });
      p.drawText("Not on file", { x: 50, y: height - 80, size: 12, font: timesRomanFont });
      return;
    }

    try {
      // @vercel/blob get() using pattern
      const result = await get(docUrl, { access: 'private' });
      if (!result) throw new Error("Blob not found");

      // Extract ArrayBuffer correctly using Response wrapping of the stream
      const arrayBuffer = await new Response(result.stream as unknown as ReadableStream).arrayBuffer();
      
      const contentType = (result as any).blob?.contentType || (result as any).contentType || 'application/octet-stream';
      const isPdf = contentType === 'application/pdf' || docUrl.toLowerCase().includes('.pdf');
      const isJpg = contentType === 'image/jpeg' || docUrl.toLowerCase().includes('.jpg') || docUrl.toLowerCase().includes('.jpeg');
      const isPng = contentType === 'image/png' || docUrl.toLowerCase().includes('.png');

      if (isPdf) {
        const externalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await pdfDoc.copyPages(externalPdf, externalPdf.getPageIndices());
        copiedPages.forEach((cp) => {
          pdfDoc.addPage(cp);
          cp.drawText(`${docType} (Uploaded: ${docUrl})`, { x: 20, y: cp.getSize().height - 20, size: 10, font: timesRomanBold, color: rgb(0,0,0) });
        });
      } else if (isJpg || isPng) {
        let embeddedImage;
        if (isJpg) embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        else embeddedImage = await pdfDoc.embedPng(arrayBuffer);

        const p = pdfDoc.addPage();
        const { width: pw, height: ph } = p.getSize();
        p.drawText(`${docType}`, { x: 50, y: ph - 30, size: 16, font: timesRomanBold });
        
        // Scale image to fit within page bounds (with some margin)
        const margin = 50;
        const maxWidth = pw - margin * 2;
        const maxHeight = ph - margin * 2 - 40; // leave room for title
        const scale = Math.min(maxWidth / embeddedImage.width, maxHeight / embeddedImage.height);
        const imgDims = embeddedImage.scale(scale);

        p.drawImage(embeddedImage, {
          x: pw / 2 - imgDims.width / 2,
          y: ph / 2 - imgDims.height / 2 - 20,
          width: imgDims.width,
          height: imgDims.height,
        });
      } else {
        // Unsupported format
        const p = pdfDoc.addPage();
        p.drawText(`${docType}`, { x: 50, y: height - 50, size: 16, font: timesRomanBold });
        p.drawText(`Document on file — format not supported for export`, { x: 50, y: height - 80, size: 12, font: timesRomanFont, color: rgb(1, 0, 0) });
        p.drawText(`URL: ${docUrl}`, { x: 50, y: height - 100, size: 10, font: timesRomanFont });
      }
    } catch (err: any) {
      console.error(`Error processing ${docType} for agent ${agent.id}:`, err);
      const p = pdfDoc.addPage();
      p.drawText(`${docType}`, { x: 50, y: height - 50, size: 16, font: timesRomanBold });
      p.drawText(`Error retrieving document: ${err.message}`, { x: 50, y: height - 80, size: 12, font: timesRomanFont, color: rgb(1, 0, 0) });
    }
  };

  await processDocument(agent.driversLicense, "Driver's License");
  await processDocument(agent.autoInsurance, "Auto Insurance");

  // Footer function
  const pages = pdfDoc.getPages();
  const footerText = `Agent: ${agent.name} | Generated: ${new Date().toLocaleDateString()} by ${caller.name}`;
  for (const p of pages) {
    p.drawText(footerText, {
      x: 50,
      y: 20,
      size: 9,
      font: timesRomanFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  }

  // Audit log
  console.log(`[AUDIT] Agent record export generated by admin ${caller.email} for agent ${agent.email} at ${new Date().toISOString()}`);

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="agent-record-${agent.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
    }
  });
}
