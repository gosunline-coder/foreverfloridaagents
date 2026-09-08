"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

type EnrichedLog = {
  id: string;
  actorEmail: string;
  action: string;
  targetUserId: string | null;
  targetName: string | null;
  targetEmail: string | null;
  metadata: any;
  createdAt: string;
};

type Target = {
  id: string;
  name: string;
  email: string;
};

export function AuditViewClient({ logs, targets }: { logs: EnrichedLog[], targets: Target[] }) {
  const [targetFilter, setTargetFilter] = useState<string>("all");

  const filteredLogs = targetFilter === "all" 
    ? logs 
    : logs.filter(l => l.targetUserId === targetFilter);

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardHeader className="bg-muted border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg">Event History</CardTitle>
          </div>
          <CardDescription>Append-only record of administrative actions.</CardDescription>
        </div>
        
        <div>
          <select 
            className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue text-foreground"
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
          >
            <option value="all">All Targets</option>
            {targets.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="border-border">
              <TableHead className="pl-6 text-muted-foreground w-48">Timestamp</TableHead>
              <TableHead className="text-muted-foreground w-64">Actor</TableHead>
              <TableHead className="text-muted-foreground w-48">Action</TableHead>
              <TableHead className="text-muted-foreground w-64">Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="border-border hover:bg-muted/50">
                <TableCell className="pl-6 text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium text-foreground">{log.actorEmail}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-400/20">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.targetName ? `${log.targetName} (${log.targetEmail})` : (log.targetUserId || "None")}
                </TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No audit events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
