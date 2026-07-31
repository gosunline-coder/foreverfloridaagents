"use server";

import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function inviteAgent(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  // Generate a unique token
  const token = crypto.randomUUID();

  let user;
  try {
    // Create the user in the database
    user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: "agent",
        status: "invited",
        inviteToken: token,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error("An agent with this email address already exists.");
    }
    throw new Error("Failed to create agent in the database.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://foreverfloridaagents.vercel.app";
  const magicLink = `${appUrl}/invite/${token}`;

  // Only send the email if the API key is configured
  if (resend) {
    const { error } = await resend.emails.send({
      from: "Forever Florida Real Estate <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Forever Florida! Complete your onboarding",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a;">Welcome to the Team, ${name}!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            We are thrilled to have you join Forever Florida Real Estate. To get started, please complete your profile and acknowledge our office policies.
          </p>
          <div style="margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Complete Your Profile
            </a>
          </div>
          <p style="color: #475569; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${magicLink}" style="color: #2563eb;">${magicLink}</a>
          </p>
        </div>
      `,
    });
    
    if (error) {
      console.error("Resend API Error:", error);
      throw new Error("Agent created, but failed to send the email: " + error.message);
    }
  } else {
    console.warn("RESEND_API_KEY is not set. Email was not sent.");
    // If there is no API key, we will still return the token so the UI can gracefully handle it if needed.
  }

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
