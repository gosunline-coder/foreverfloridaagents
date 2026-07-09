"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileCheck, Package } from "lucide-react";

export default function AdminDashboardPage() {
  const agents = [
    { name: "John Doe", status: "Onboarding", progress: "60%", license: "SL1234567" },
    { name: "Sarah Smith", status: "Active", progress: "100%", license: "SL7654321" },
    { name: "Mike Johnson", status: "Overdue", progress: "20%", license: "Pending" },
  ];

  const audits = [
    { agent: "John Doe", doc: "Office Policies v2", date: "2023-10-25 09:12 AM" },
    { agent: "Sarah Smith", doc: "Independent Contractor Agreement", date: "2023-10-24 02:45 PM" },
  ];

  const inventory = [
    { item: "Directional Signs", total: 100, assigned: 45, available: 55 },
    { item: "Bluetooth Lockboxes", total: 50, assigned: 48, available: 2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of agent onboarding, compliance, and office inventory.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Onboarding Status */}
        <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Agent Onboarding & Roster</CardTitle>
            </div>
            <CardDescription>Track onboarding progress and license numbers.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Agent Name</TableHead>
                  <TableHead>License #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.name}>
                    <TableCell className="pl-6 font-medium">{agent.name}</TableCell>
                    <TableCell className="text-slate-500">{agent.license}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        agent.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        agent.status === 'Onboarding' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }>
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.progress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
      <Card className="shadow-sm border-slate-200 max-w-4xl">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Policy Acknowledgment Audit Log</CardTitle>
          </div>
          <CardDescription>Recent electronic signatures for mandatory policies.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Agent</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((audit, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6 font-medium">{audit.agent}</TableCell>
                  <TableCell>{audit.doc}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{audit.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
