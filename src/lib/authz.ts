import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: No active session");
  }

  // 1. Try to find user by clerkId
  let user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Unauthorized: User not found in Clerk");
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress;
    if (!email) {
      throw new Error("Unauthorized: No primary email address");
    }

    // 2. Fall back to email matching for records where clerkId is null
    user = await prisma.user.findFirst({
      where: { 
        email: { equals: email, mode: 'insensitive' },
        clerkId: null 
      }
    });

    if (!user) {
      // Reject if the email matches a record that already has a DIFFERENT clerkId
      const existing = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        select: { clerkId: true }
      });
      if (existing && existing.clerkId && existing.clerkId !== userId) {
        throw new Error("Unauthorized: Email is already claimed by a different Clerk account");
      }
      throw new Error("Unauthorized: User not found in database");
    }

    // 3. Claim the user
    user = await prisma.user.update({
      where: { id: user.id },
      data: { clerkId: userId }
    });
  }

  if (user.status !== "active") {
    throw new Error("Unauthorized: User account is not active");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  
  if (user.role !== "admin" && user.role !== "superadmin") {
    throw new Error("Forbidden: Requires admin privileges");
  }
  
  return user;
}

export async function requireSuperadmin() {
  const user = await requireUser();
  
  if (user.role !== "superadmin") {
    throw new Error("Forbidden: Requires superadmin privileges");
  }
  
  return user;
}
