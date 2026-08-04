import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, AlertCircle } from "lucide-react";
import { AddAgentModal } from "./AddAgentModal";
import { AgentRosterClient } from "./AgentRosterClient";
import { AuditLogClient } from "./AuditLogClient";
import { prisma } from "@/lib/db";
import { getInventorySummary, seedInventoryCatalog } from "@/app/actions/catalog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Ensure inventory is seeded
  await seedInventoryCatalog();

  // Fetch data
  const [users, modules, docs, allAcks, inventory] = await Promise.all([
    prisma.user.findMany({
      where: { role: "agent" },
      include: {
        completions: { include: { module: true } },
        docAcks: { include: { document: true } },
        supplyRequests: true
      },
      orderBy: { hireDate: 'desc' }
    }),
    prisma.trainingModule.findMany(),
    prisma.document.findMany(),
    prisma.docAck.findMany({
      include: { user: true, document: true },
      orderBy: { ackedAt: 'desc' }
    }),
    getInventorySummary()
  ]);

  const totalModules = modules.length;
  const totalDocs = docs.length;

  // Compute status for agents
  const now = new Date();
  const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

  const agentData = users.map(user => {
    let computedStatus = user.status;
    const progress = totalModules > 0 ? (user.completions.length / totalModules) : 0;

    if (user.status === "active") {
      if (progress >= 1) {
        computedStatus = "Active";
      } else {
        // They are onboarding. Are they overdue?
        const isOverdue = (now.getTime() - new Date(user.hireDate).getTime()) > FOURTEEN_DAYS_MS;
        computedStatus = isOverdue ? "Overdue" : "Onboarding";
      }
    } else if (user.status === "invited") {
      computedStatus = "Invited";
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      licenseNumber: user.licenseNumber,
      licenseStatus: user.licenseStatus,
      licenseExpiration: user.licenseExpiration,
      lastVerifiedAt: user.lastVerifiedAt,
      mlsNumber: user.mlsNumber,
      driversLicense: user.driversLicense,
      autoInsurance: user.autoInsurance,
      status: computedStatus,
      hireDate: user.hireDate,
      completions: user.completions,
      docAcks: user.docAcks,
      supplyRequests: user.supplyRequests
    };
  });

  // Calculate expiring licenses (within 60 days)
  const expiringAgents = agentData.filter(agent => {
    if (!agent.licenseExpiration) return false;
    const expDate = new Date(agent.licenseExpiration);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - now.getTime();
    const daysUntilExp = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysUntilExp <= 60 && daysUntilExp >= -30; // Also show recently expired (up to 30 days)
  }).sort((a, b) => new Date(a.licenseExpiration!).getTime() - new Date(b.licenseExpiration!).getTime());

  const auditData = allAcks.map(ack => ({
    id: ack.id,
    agentName: ack.user.name,
    documentTitle: ack.document.title,
    date: ack.ackedAt
  }));



  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of agent onboarding, compliance, and office inventory.</p>
        </div>
        <AddAgentModal />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Agent Roster */}
        <AgentRosterClient agents={agentData} totalModules={totalModules} totalDocs={totalDocs} />

        {/* Expiring Licenses Widget */}
        <Card className="bg-card border-border md:col-span-1 lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> 
              Expiring Licenses
            </CardTitle>
            <CardDescription>Licenses expiring within 60 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
            {expiringAgents.length === 0 ? (
              <p className="text-sm text-slate-500">No licenses expiring soon.</p>
            ) : (
              expiringAgents.map(agent => {
                const days = Math.ceil((new Date(agent.licenseExpiration!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isExpired = days <= 0;
                return (
                  <div key={agent.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/50">
                    <div>
                      <p className="font-medium text-sm text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isExpired ? (
                          <span className="text-red-400">Expired {Math.abs(days)} days ago</span>
                        ) : (
                          <span className={days <= 30 ? "text-red-400" : "text-amber-400"}>Expires in {days} days</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{agent.licenseNumber}</p>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Inventory Summary */}
        <Card className="bg-card border-border lg:col-span-1 shadow-sm">
          <CardHeader className="bg-muted border-b border-border flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Inventory Summary</CardTitle>
            </div>
            <Link href="/admin/inventory">
              <Button variant="outline" size="sm">Manage Catalog</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {inventory.map((inv) => (
              <div key={inv.item} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-medium text-sm">{inv.item}</h4>
                  <div className="flex gap-2 text-xs text-slate-400 mt-1">
                    <span>{inv.assigned} assigned / {inv.total} total</span>
                    <span>•</span>
                    <span>Limit: {inv.maxPerAgent}</span>
                    <span>•</span>
                    <span>{inv.cost === 0 ? "Free" : `$${inv.cost.toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${inv.available < (inv.total * 0.1) ? 'text-red-500' : 'text-slate-200'}`}>
                    {inv.available}
                  </span>
                  <p className="text-xs text-slate-400">avail</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Policy Audit Log */}
      <AuditLogClient audits={auditData} />
    </div>
  );
}
