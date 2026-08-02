"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInventoryCatalog() {
  return await prisma.inventoryCatalog.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function getInventorySummary() {
  const catalog = await prisma.inventoryCatalog.findMany({
    orderBy: { name: 'asc' }
  });

  const requests = await prisma.supplyRequest.findMany();
  
  return catalog.map(item => {
    const assigned = requests
      .filter(req => req.itemType === item.name)
      .reduce((sum, req) => sum + req.quantity, 0);
      
    return {
      id: item.id,
      item: item.name,
      total: item.totalStock,
      assigned: assigned,
      available: item.totalStock - assigned,
      cost: item.cost,
      maxPerAgent: item.maxPerAgent,
      isReturnable: item.isReturnable,
      isActive: item.isActive
    };
  });
}

export async function updateCatalogItem(id: string, data: { name: string; cost: number; maxPerAgent: number; totalStock: number; isReturnable: boolean; isActive: boolean }) {
  await prisma.inventoryCatalog.update({
    where: { id },
    data
  });
  revalidatePath("/admin");
  revalidatePath("/supply");
  return { success: true };
}

export async function createCatalogItem(data: { name: string; cost: number; maxPerAgent: number; totalStock: number; isReturnable: boolean; isActive: boolean }) {
  await prisma.inventoryCatalog.create({ data });
  revalidatePath("/admin");
  revalidatePath("/supply");
  return { success: true };
}

export async function seedInventoryCatalog() {
  const count = await prisma.inventoryCatalog.count();
  if (count === 0) {
    await prisma.inventoryCatalog.createMany({
      data: [
        { name: "Yard Sign (For Sale)", cost: 0, maxPerAgent: 20, totalStock: 100, isReturnable: true },
        { name: "Open House Directional Signs", cost: 0, maxPerAgent: 10, totalStock: 50, isReturnable: true },
        { name: "Bluetooth Lockbox", cost: 100.0, maxPerAgent: 5, totalStock: 30, isReturnable: true },
        { name: "Name Badge", cost: 15.0, maxPerAgent: 2, totalStock: 500, isReturnable: false },
        { name: "Business Cards (500ct)", cost: 25.0, maxPerAgent: 5, totalStock: 1000, isReturnable: false },
      ]
    });
  }
}
