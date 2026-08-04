"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileCheck, Search } from "lucide-react";

type AuditData = {
  id: string;
  agentName: string;
  documentTitle: string;
  date: Date;
};

type Props = {
  audits: AuditData[];
};

export function AuditLogClient({ audits }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAudits = audits.filter(audit => 
    audit.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.documentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-sm border-border bg-card max-w-4xl">
      <CardHeader className="bg-muted border-b border-border space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Policy Acknowledgment Audit Log</CardTitle>
          </div>
          <CardDescription>Full history of electronic signatures for mandatory policies.</CardDescription>
        </div>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Filter by agent or document..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background border-border text-foreground"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredAudits.length > 0 ? (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-border">
                <TableHead className="pl-6 text-muted-foreground">Agent</TableHead>
                <TableHead className="text-muted-foreground">Document</TableHead>
                <TableHead className="text-muted-foreground">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.map((audit) => (
                <TableRow key={audit.id} className="border-border hover:bg-muted/50">
                  <TableCell className="pl-6 font-medium text-foreground">{audit.agentName}</TableCell>
                  <TableCell className="text-muted-foreground">{audit.documentTitle}</TableCell>
                  <TableCell className="text-muted-foreground">{audit.date.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No audit logs found matching "{searchTerm}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}
