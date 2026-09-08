"use server";

import { prisma } from "@/lib/db";
import { requireSuperadmin, requireAdmin } from "@/lib/authz";
import { writeAudit } from "@/lib/audit";
import { Prisma } from "@prisma/client";





export async function getAllSupplyRequests() {
  await requireAdmin();
  const args = {
    include: {
      user: true,
    },
    orderBy: {
      requestedAt: 'desc',
    }
  } satisfies Prisma.SupplyRequestFindManyArgs;
  const requests = await prisma.supplyRequest.findMany(args);

  const catalog = await prisma.inventoryCatalog.findMany();
  const catalogMap = new Map(catalog.map(c => [c.name, c]));

  return requests.map(req => ({
    id: req.id,
    agentName: req.user.name,
    itemType: req.itemType,
    quantity: req.quantity,
    status: req.status,
    propertyAddress: req.propertyAddress,
    isReturnable: catalogMap.get(req.itemType)?.isReturnable || false,
    requestedAt: req.requestedAt.toISOString(),
    returnedAt: req.returnedAt ? req.returnedAt.toISOString() : null,
  }));
}

export async function fulfillSupplyRequest(requestId: string) {
  await requireAdmin();
  await prisma.supplyRequest.update({
    where: { id: requestId },
    data: { status: 'fulfilled' },
  });
  return { success: true };
}

export async function returnSupplyRequest(requestId: string) {
  await requireAdmin();
  await prisma.supplyRequest.update({
    where: { id: requestId },
    data: { status: 'returned', returnedAt: new Date() },
  });
  return { success: true };
}

export async function verifyAgentLicense(agentId: string, status: string, expirationDate: Date | null) {
  const actor = await requireAdmin();
  try {
    await prisma.user.update({
      where: { id: agentId },
      data: {
        licenseStatus: status,
        licenseExpiration: expirationDate,
        lastVerifiedAt: new Date(),
      }
    });
  } catch (error) {
    console.error("Failed to verify license:", error);
    return { success: false, error: "Failed to update license status." };
  }

  await writeAudit({
    actor,
    targetUserId: agentId,
    action: 'license.verify',
    metadata: { status, expirationDate: expirationDate ? expirationDate.toISOString() : null }
  });

  return { success: true };
}

export async function updateAgentBasicInfo(
  agentId: string, 
  data: { name: string, phone: string, mlsNumber: string, email: string, address?: string, city?: string, state?: string, zip?: string }
) {
  const actor = await requireAdmin();
  try {
    await prisma.user.update({
      where: { id: agentId },
      data: {
        name: data.name,
        phone: data.phone || null,
        mlsNumber: data.mlsNumber || null,
        email: data.email,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
      }
    });
  } catch (error) {
    console.error("Failed to update basic info:", error);
    return { success: false, error: "Failed to update profile." };
  }

  await writeAudit({
    actor,
    targetUserId: agentId,
    action: 'agent.update',
    metadata: { fieldsChanged: Object.keys(data) }
  });

  return { success: true };
}

export async function archiveAgent(agentId: string) {
  const actor = await requireSuperadmin();
  try {
    await prisma.user.update({
      where: { id: agentId },
      data: {
        status: 'departed',
        archivedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error("Failed to archive agent:", error);
    return { success: false, error: error?.message || "Failed to archive agent." };
  }

  await writeAudit({
    actor,
    targetUserId: agentId,
    action: 'agent.archive'
  });

  return { success: true };
}

// --- Recruiting Inquiries Actions ---

export async function getInquiries() {
  await requireAdmin();
  const args = {
    orderBy: { submittedAt: 'desc' },
    include: {
      notes: {
        orderBy: { createdAt: 'desc' }
      }
    }
  } satisfies Prisma.InquiryFindManyArgs;
  const inquiries = await prisma.inquiry.findMany(args);
  return inquiries.map(inq => ({
    ...inq,
    submittedAt: inq.submittedAt.toISOString(),
    notes: inq.notes.map(n => ({
      id: n.id,
      text: n.text,
      createdAt: n.createdAt.toISOString()
    }))
  }));
}

export async function updateInquiryStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.inquiry.update({
    where: { id },
    data: { status }
  });
  return { success: true };
}

export async function addInquiryNote(inquiryId: string, text: string) {
  await requireAdmin();
  const note = await prisma.inquiryNote.create({
    data: { inquiryId, text }
  });
  return { success: true, note: { id: note.id, text: note.text, createdAt: note.createdAt.toISOString() } };
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await prisma.inquiry.delete({
    where: { id }
  });
  return { success: true };
}
