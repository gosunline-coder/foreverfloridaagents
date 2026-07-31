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
