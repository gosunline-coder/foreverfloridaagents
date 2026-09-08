import { requireSuperadmin } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { AuditViewClient } from "./AuditViewClient";

export const dynamic = 'force-dynamic';

export default async function SuperadminAuditPage() {
  await requireSuperadmin();

  // Fetch audit logs
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Get unique target user IDs to fetch their names/emails for filtering
  const targetIds = Array.from(new Set(logs.map(l => l.targetUserId).filter(Boolean))) as string[];
  
  const targets = await prisma.user.findMany({
    where: { id: { in: targetIds } },
    select: { id: true, name: true, email: true }
  });

  const targetsMap = new Map(targets.map(t => [t.id, t]));

  const enrichedLogs = logs.map(log => {
    const target = log.targetUserId ? targetsMap.get(log.targetUserId) : null;
    return {
      id: log.id,
      actorEmail: log.actorEmail,
      action: log.action,
      targetUserId: log.targetUserId,
      targetName: target ? target.name : null,
      targetEmail: target ? target.email : null,
      metadata: log.metadata,
      createdAt: log.createdAt.toISOString()
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">System Audit Log</h1>
        <p className="text-muted-foreground mt-2">Superadmin view of all sensitive actions across the platform.</p>
      </div>

      <AuditViewClient logs={enrichedLogs} targets={targets} />
    </div>
  );
}
