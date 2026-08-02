"use server";

import { prisma } from "@/lib/db";

export async function getAllSupplyRequests() {
  const requests = await prisma.supplyRequest.findMany({
    include: {
      user: true, // Fetch the agent details
    },
    orderBy: {
      requestedAt: 'desc',
    }
  });

  return requests.map(req => ({
    id: req.id,
    agentName: req.user.name,
    itemType: req.itemType,
    quantity: req.quantity,
    status: req.status,
    requestedAt: req.requestedAt.toISOString(),
  }));
}

export async function fulfillSupplyRequest(requestId: string) {
  await prisma.supplyRequest.update({
    where: { id: requestId },
    data: { status: 'fulfilled' },
  });
  return { success: true };
}

export async function deleteAgent(agentId: string) {
  try {
    // Wrap in a transaction to ensure atomicity
    await prisma.$transaction([
      prisma.completion.deleteMany({ where: { userId: agentId } }),
      prisma.docAck.deleteMany({ where: { userId: agentId } }),
      prisma.supplyRequest.deleteMany({ where: { userId: agentId } }),
      prisma.inventoryItem.deleteMany({ where: { userId: agentId } }),
      prisma.user.delete({ where: { id: agentId } })
    ]);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete agent:", error);
    return { success: false, error: error?.message || "Failed to delete agent." };
  }
}
