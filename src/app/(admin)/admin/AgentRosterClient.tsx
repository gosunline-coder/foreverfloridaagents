"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, X, BookOpen, FileCheck, Package } from "lucide-react";

type AgentData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  licenseNumber: string | null;
  mlsNumber: string | null;
  status: string;
  hireDate: Date;
  completions: any[];
  docAcks: any[];
  supplyRequests: any[];
};

type Props = {
  agents: AgentData[];
  totalModules: number;
  totalDocs: number;
};

export function AgentRosterClient({ agents, totalModules, totalDocs }: Props) {
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Onboarding": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Overdue": return "bg-red-50 text-red-700 border-red-200";
      case "Invited": default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <>
      <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Agent Onboarding & Roster</CardTitle>
          </div>
          <CardDescription>Track onboarding progress and license numbers. Click any row for details.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Agent Name</TableHead>
                <TableHead>License #</TableHead>
                <TableHead>MLS ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const progress = totalModules > 0 ? Math.round((agent.completions.length / totalModules) * 100) : 0;
                
                return (
                  <TableRow 
                    key={agent.id} 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <TableCell className="pl-6 font-medium">{agent.name}</TableCell>
                    <TableCell className="text-slate-500">{agent.licenseNumber || "Pending"}</TableCell>
                    <TableCell className="text-slate-500">{agent.mlsNumber || "Pending"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{progress}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slide-out Modal for Agent Details */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
          <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl overflow-y-auto shadow-2xl animate-in slide-in-from-right-1/2 duration-300">
            <CardHeader className="sticky top-0 bg-white z-10 border-b flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedAgent.name}</CardTitle>
                  <CardDescription>{selectedAgent.email} • {selectedAgent.phone || "No phone"}</CardDescription>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Profile Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" /> Credentials
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border">
                  <div>
                    <p className="text-slate-500">License Number</p>
                    <p className="font-medium">{selectedAgent.licenseNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">MLS ID</p>
                    <p className="font-medium">{selectedAgent.mlsNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Hire Date</p>
                    <p className="font-medium">{new Date(selectedAgent.hireDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <Badge variant="outline" className={getStatusColor(selectedAgent.status)}>
                      {selectedAgent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Training Progress */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" /> Training Modules ({selectedAgent.completions.length}/{totalModules})
                </h3>
                {selectedAgent.completions.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {selectedAgent.completions.map(c => (
                      <li key={c.id} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border">
                        <span>{c.module?.title || "Unknown Module"}</span>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No training completed yet.</p>
                )}
              </div>

              {/* Document Acknowledgments */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-slate-400" /> Documents Acknowledged ({selectedAgent.docAcks.length}/{totalDocs})
                </h3>
                {selectedAgent.docAcks.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {selectedAgent.docAcks.map(ack => (
                      <li key={ack.id} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border">
                        <span>{ack.document?.title || "Unknown Document"}</span>
                        <span className="text-slate-500 text-xs">{new Date(ack.ackedAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No documents acknowledged yet.</p>
                )}
              </div>

              {/* Supply Requests */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-slate-400" /> Supply Requests
                </h3>
                {selectedAgent.supplyRequests.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {selectedAgent.supplyRequests.map(req => (
                      <li key={req.id} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border">
                        <span>{req.quantity}x {req.itemType}</span>
                        <Badge variant="outline">{req.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No supply requests.</p>
                )}
              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
