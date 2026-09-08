import { prisma } from "@/lib/db";

type AuditParams = {
  actor: { id: string; email: string };
  targetUserId?: string | null;
  action: string;
  metadata?: any;
  ipAddress?: string | null;
};

export async function writeAudit({ actor, targetUserId, action, metadata, ipAddress }: AuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: actor.id,
        actorEmail: actor.email,
        targetUserId,
        action,
        metadata: metadata ?? undefined,
        ipAddress
      }
    });
  } catch (error) {
    console.error("FATAL: Failed to write audit log entry. Context:", {
      actor,
      targetUserId,
      action,
      metadata,
      ipAddress,
      error
    });
  }
}
