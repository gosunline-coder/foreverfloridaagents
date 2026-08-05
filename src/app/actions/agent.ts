"use server";

import { prisma } from "@/lib/db";
import { put } from "@vercel/blob";

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

export async function syncMockUser(user: { id: string, name: string, email: string, role: string }) {
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
  return { success: true, user: dbUser };
}

export async function syncUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return { user };
}

export async function updateProfile(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const licenseNumber = formData.get("licenseNumber") as string;
  const mlsNumber = formData.get("mlsNumber") as string;
  try {
    let driversLicenseUrl: string | undefined;
    let autoInsuranceUrl: string | undefined;

    const driversLicenseFile = formData.get("driversLicense") as File | null;
    if (driversLicenseFile && driversLicenseFile.size > 0) {
      // @ts-ignore
      const blob = await put(`licenses/${userId}-${driversLicenseFile.name}`, driversLicenseFile, { access: 'private' });
      driversLicenseUrl = blob.url;
    }

    const autoInsuranceFile = formData.get("autoInsurance") as File | null;
    if (autoInsuranceFile && autoInsuranceFile.size > 0) {
      // @ts-ignore
      const blob = await put(`insurance/${userId}-${autoInsuranceFile.name}`, autoInsuranceFile, { access: 'private' });
      autoInsuranceUrl = blob.url;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        licenseNumber: licenseNumber || null,
        mlsNumber: mlsNumber || null,
        ...(driversLicenseUrl && { driversLicense: driversLicenseUrl }),
        ...(autoInsuranceUrl && { autoInsurance: autoInsuranceUrl }),
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleProfileChecklist(userId: string, field: "zillowProfile" | "realtorProfile" | "redfinProfile", value: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        [field]: value,
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle profile checklist:", error);
    return { success: false, error: "Failed to save checklist." };
  }
}
