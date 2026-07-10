import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { AddAgentModal } from "./AddAgentModal";
import { AgentRosterClient } from "./AgentRosterClient";
import { AuditLogClient } from "./AuditLogClient";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch data
  const [users, modules, docs, allAcks] = await Promise.all([
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
    })
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
      mlsNumber: user.mlsNumber,
      status: computedStatus,
      hireDate: user.hireDate,
      completions: user.completions,
      docAcks: user.docAcks,
      supplyRequests: user.supplyRequests
    };
  });

  const auditData = allAcks.map(ack => ({
    id: ack.id,
    agentName: ack.user.name,
    documentTitle: ack.document.title,
    date: ack.ackedAt
  }));

  // Mock inventory for now, since we don't have an Inventory model fully utilized yet
  const inventory = [
    { item: "Directional Signs", total: 100, assigned: 45, available: 55 },
    { item: "Bluetooth Lockboxes", total: 50, assigned: 48, available: 2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Overview of agent onboarding, compliance, and office inventory.</p>
        </div>
        <AddAgentModal />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Agent Roster */}
        <AgentRosterClient agents={agentData} totalModules={totalModules} totalDocs={totalDocs} />

        {/* Inventory Summary */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Inventory Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {inventory.map((inv) => (
              <div key={inv.item} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-medium text-sm">{inv.item}</h4>
                  <p className="text-xs text-slate-500">{inv.assigned} assigned / {inv.total} total</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${inv.available < 5 ? 'text-red-500' : 'text-slate-700'}`}>
                    {inv.available}
                  </span>
                  <p className="text-xs text-slate-500">avail</p>
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
