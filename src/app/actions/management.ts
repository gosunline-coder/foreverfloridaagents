"use server";

import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function getAdmins() {
  const admins = await prisma.user.findMany({
    // Only fetch admins, deliberately exclude superadmins to keep them hidden
    where: { role: "admin" },
    orderBy: { name: 'asc' }
  });
  
  return admins;
}

export async function inviteAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email) {
    return { success: false, error: "Name and email are required" };
  }

  // Generate a unique token
  const token = crypto.randomUUID();

  let user;
  try {
    // Create the admin user in the database
    user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: "admin", // Explicitly create an admin
        status: "invited",
        inviteToken: token,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "A user with this email address already exists." };
    }
    return { success: false, error: "Failed to create admin in the database: " + error.message };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://foreverfloridaagents.vercel.app";
  const magicLink = `${appUrl}/invite/${token}`;

  // Only send the email if the API key is configured
  if (resend) {
    const { error } = await resend.emails.send({
      from: "Forever Florida Admin <onboarding@resend.dev>",
      to: [email],
      subject: "You've been invited as an Admin to Forever Florida",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a;">Welcome to the Leadership Team, ${name}!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            You have been invited to join the Forever Florida Real Estate Admin Portal. Please click the link below to accept your invitation and create your account.
          </p>
          <div style="margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Accept Invitation
            </a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: true, token, warning: "Admin created but email failed to send." };
    }
  }

  return { success: true, token };
}
