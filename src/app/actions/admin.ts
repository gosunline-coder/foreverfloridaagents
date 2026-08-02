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
    // 1. Delete all completions
    await prisma.completion.deleteMany({
      where: { userId: agentId },
    });

    // 2. Delete all doc acknowledgements
    await prisma.docAck.deleteMany({
      where: { userId: agentId },
    });

    // 3. Delete all supply requests
    await prisma.supplyRequest.deleteMany({
      where: { userId: agentId },
    });

    // 4. Delete all inventory items associated
    await prisma.inventoryItem.deleteMany({
      where: { userId: agentId },
    });

    // 5. Finally, delete the user
    await prisma.user.delete({
      where: { id: agentId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete agent:", error);
    return { success: false, error: "Failed to delete agent." };
  }
}
