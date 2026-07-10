"use server";

import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function inviteAgent(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  // Generate a unique token
  const token = crypto.randomUUID();

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      role: "agent",
      status: "invited",
      inviteToken: token,
    },
  });

  // In a real app, we would send an email here using SendGrid or Resend.
  // For this PoC, we just return the token to generate a magic link.
  return token;
}

export async function getInviteByToken(token: string) {
  const user = await prisma.user.findUnique({
    where: { inviteToken: token },
  });
  return user;
}

export async function completeOnboarding(token: string, formData: FormData) {
  const mlsNumber = formData.get("mlsNumber") as string;
  const licenseNumber = formData.get("licenseNumber") as string;

  if (!mlsNumber || !licenseNumber) {
    throw new Error("MLS Number and License Number are required");
  }

  const user = await prisma.user.findUnique({
    where: { inviteToken: token },
  });

  if (!user) {
    throw new Error("Invalid or expired invitation token");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      mlsNumber,
      licenseNumber,
      status: "active",
      inviteToken: null, // clear the token
    },
  });

  return updatedUser;
}
