"use server";

import { prisma } from "@/lib/db";
import crypto from "crypto";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { put } from "@vercel/blob";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function inviteAgent(formData: FormData) {
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
      return { success: false, error: "An agent with this email address already exists." };
    }
    return { success: false, error: "Failed to create agent in the database: " + error.message };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://foreverfloridaagents.vercel.app";
  const magicLink = `${appUrl}/invite/${token}`;

  // Only send the email if the API key is configured
  if (resend) {
    const { error } = await resend.emails.send({
      from: "Forever Florida Real Estate <onboarding@foreverfloridaagents.com>",
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
      return { success: false, error: "Agent created, but failed to send the email: " + error.message };
    }
  } else {
    console.warn("RESEND_API_KEY is not set. Email was not sent.");
  }

  return { success: true, token };
}

export async function getInviteByToken(token: string) {
  const user = await prisma.user.findUnique({
    where: { inviteToken: token },
  });
  return user;
}

export async function completeOnboarding(token: string, formData: FormData) {
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const mlsNumber = formData.get("mlsNumber") as string;
  const licenseNumber = formData.get("licenseNumber") as string;

  if (!mlsNumber || !licenseNumber) {
    return { success: false, error: "MLS Number and License Number are required" };
  }

  const user = await prisma.user.findUnique({
    where: { inviteToken: token },
  });

  if (!user) {
    return { success: false, error: "Invalid or expired invitation token. You may have already completed your profile." };
  }
  
  let driversLicenseUrl: string | null = null;
  let autoInsuranceUrl: string | null = null;

  const driversLicenseFile = formData.get("driversLicense") as File | null;
  if (driversLicenseFile && driversLicenseFile.size > 0) {
    // @ts-ignore - 'private' access is supported by the store configuration
    const blob = await put(`licenses/${user.id}-${driversLicenseFile.name}`, driversLicenseFile, { access: 'private' });
    driversLicenseUrl = blob.url;
  } else {
    // If it's just a string, it might be the old base64 we didn't change, but it should be a file now.
    driversLicenseUrl = formData.get("driversLicense") as string | null;
  }

  const autoInsuranceFile = formData.get("autoInsurance") as File | null;
  if (autoInsuranceFile && autoInsuranceFile.size > 0) {
    // @ts-ignore
    const blob = await put(`insurance/${user.id}-${autoInsuranceFile.name}`, autoInsuranceFile, { access: 'private' });
    autoInsuranceUrl = blob.url;
  } else {
    autoInsuranceUrl = formData.get("autoInsurance") as string | null;
  }

  const acknowledgedDocs = formData.getAll("acknowledgedDocs") as string[];

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      phone: phone || user.phone,
      address,
      city,
      state,
      zip,
      mlsNumber,
      licenseNumber,
      driversLicense: driversLicenseUrl,
      autoInsurance: autoInsuranceUrl,
      status: "active",
      inviteToken: null, // clear the token
    },
  });

  // Create document acknowledgements
  if (acknowledgedDocs && acknowledgedDocs.length > 0) {
    for (const docId of acknowledgedDocs) {
      await prisma.docAck.create({
        data: {
          userId: user.id,
          documentId: docId,
        }
      });
    }
  }

  // Send Welcome Email
  if (resend) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://foreverfloridaagents.vercel.app";
    await resend.emails.send({
      from: "Forever Florida Real Estate <onboarding@foreverfloridaagents.com>",
      to: [user.email],
      subject: "Welcome to Forever Florida Real Estate!",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a;">Welcome aboard, ${user.name}!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Thank you for registering. Your agent profile has been successfully activated. You can now log into your Agent Dashboard and begin your training.
          </p>
          <div style="margin: 30px 0;">
            <a href="${appUrl}/sign-in" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Go to Login
            </a>
          </div>
          <p style="color: #475569; font-size: 14px;">
            Your username is: <strong>${user.email}</strong>
          </p>
        </div>
      `,
    }).catch(err => console.error("Failed to send welcome email:", err));
  }
  return { success: true, user: updatedUser };
}
