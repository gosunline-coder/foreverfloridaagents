"use server";

import { prisma } from "@/lib/db";

export async function submitInquiry(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const currentBrokerage = formData.get("currentBrokerage") as string;
  const message = formData.get("message") as string;

  if (!name || !email) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        currentBrokerage: currentBrokerage || null,
        message: message || "No message provided.",
        status: "New",
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return { success: false, error: "Failed to submit inquiry." };
  }
}
