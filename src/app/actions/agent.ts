"use server";

import { prisma } from "@/lib/db";

// --- Training Actions ---

export async function getTrainingData(userId: string) {
  const modules = await prisma.trainingModule.findMany({
    orderBy: { title: 'asc' } // or any other order
  });
  
  const completions = await prisma.completion.findMany({
    where: { userId }
  });

  return { modules, completions };
}

export async function markModuleComplete(userId: string, moduleId: string) {
  // Check if it already exists
  const existing = await prisma.completion.findFirst({
    where: { userId, moduleId }
  });

  if (existing) return { success: true };

  await prisma.completion.create({
    data: {
      userId,
      moduleId,
    }
  });

  return { success: true };
}

// --- Documents Actions ---

export async function getDocumentsData(userId: string) {
  const documents = await prisma.document.findMany({
    orderBy: { title: 'asc' }
  });
  
  const acks = await prisma.docAck.findMany({
    where: { userId }
  });

  return { documents, acks };
}

export async function acknowledgeDocument(userId: string, documentId: string) {
  const existing = await prisma.docAck.findFirst({
    where: { userId, documentId }
  });

  if (existing) return { success: true };

  await prisma.docAck.create({
    data: {
      userId,
      documentId,
    }
  });

  return { success: true };
}

// --- Supply Actions ---

export async function getSupplyRequests(userId: string) {
  return prisma.supplyRequest.findMany({
    where: { userId },
    orderBy: { requestedAt: 'desc' }
  });
}

export async function getCatalog() {
  return prisma.inventoryCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });
}

export async function createSupplyRequest(userId: string, catalogId: string, quantity: number, propertyAddress?: string) {
  try {
    // Enforce limits
    const catalogItem = await prisma.inventoryCatalog.findUnique({
      where: { id: catalogId }
    });

    if (!catalogItem) {
      return { success: false, error: "Item not found" };
    }

    // Calculate current assigned count for this user
    const existingRequests = await prisma.supplyRequest.findMany({
      where: { userId, itemType: catalogItem.name, status: { not: 'returned' } }
    });
    
    const currentlyRequested = existingRequests.reduce((sum, req) => sum + req.quantity, 0);

    if (currentlyRequested + quantity > catalogItem.maxPerAgent) {
      return { success: false, error: `Limit exceeded. You can only request up to ${catalogItem.maxPerAgent} ${catalogItem.name}.` };
    }

    await prisma.supplyRequest.create({
      data: {
        userId,
        itemType: catalogItem.name,
        quantity,
        propertyAddress: propertyAddress || null,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to create supply request:", error);
    return { success: false, error: error.message || "An unexpected error occurred on the server." };
  }
}

export async function initiateReturn(requestId: string) {
  await prisma.supplyRequest.update({
    where: { id: requestId },
    data: { status: 'return_pending' }
  });
  return { success: true };
}

// --- Dashboard Actions ---

export async function getDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      licenseNumber: true,
      mlsNumber: true,
      status: true,
    }
  });

  const totalModules = await prisma.trainingModule.count();
  const completedModules = await prisma.completion.count({
    where: { userId }
  });

  return {
    user,
    totalModules,
    completedModules,
  };
}
