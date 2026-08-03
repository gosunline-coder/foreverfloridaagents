"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, X, BookOpen, FileCheck, Package, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAgent } from "@/app/actions/admin";

type AgentData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  licenseNumber: string | null;
  licenseStatus: string | null;
  licenseExpiration: Date | null;
  lastVerifiedAt: Date | null;
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteAgent = async (agentId: string) => {
    startTransition(async () => {
      const res = await deleteAgent(agentId);
      if (res.success) {
        setIsDeleteDialogOpen(false);
        setSelectedAgent(null);
        router.refresh(); // Refetch server data to update roster
      } else {
        alert(res.error || "Failed to delete agent");
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-brand-green/10 text-brand-green border-brand-green/30";
      case "Onboarding": return "bg-brand-blue/10 text-brand-blue border-brand-blue/30";
      case "Overdue": return "bg-red-50 text-red-700 border-red-200";
      case "Invited": default: return "bg-white/10 text-slate-200 border-white/20";
    }
  };

  const getDBPRStatusColor = (status: string | null) => {
    if (!status) return "bg-slate-800 text-slate-400 border-slate-700";
    if (status.includes("Delinquent, Active")) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
    if (status.includes("Active")) return "bg-brand-green/10 text-brand-green border-brand-green/30";
    return "bg-red-500/10 text-red-500 border-red-500/30";
  };

  return (
    <>
      <Card className="col-span-1 md:col-span-2 shadow-sm border-white/10">
        <CardHeader className="bg-white/5 border-b">
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
                <TableHead>DBPR Status</TableHead>
                <TableHead>MLS ID</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const progress = totalModules > 0 ? Math.round((agent.completions.length / totalModules) * 100) : 0;
                
                return (
                  <TableRow 
                    key={agent.id} 
                    className="cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <TableCell className="pl-6 font-medium">{agent.name}</TableCell>
                    <TableCell className="text-slate-400">{agent.licenseNumber || "Pending"}</TableCell>
                    <TableCell>
                      {agent.licenseStatus ? (
                        <Badge variant="outline" className={getDBPRStatusColor(agent.licenseStatus)}>
                          {agent.licenseStatus}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unverified</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400">{agent.mlsNumber || "Pending"}</TableCell>
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
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-200">
          <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl overflow-y-auto shadow-2xl bg-slate-950 border-l border-white/10 animate-in slide-in-from-right-1/2 duration-300">
            <CardHeader className="sticky top-0 bg-white/5 z-10 border-b flex flex-row items-center justify-between py-4">
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
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Profile Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" /> Credentials
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 p-4 rounded-lg border">
                  <div className="col-span-2">
                    <p className="text-slate-400">License Number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium">{selectedAgent.licenseNumber || "Not provided"}</p>
                      {selectedAgent.licenseStatus && (
                        <Badge variant={selectedAgent.licenseStatus.includes("Active") ? "default" : "destructive"} className="bg-brand-blue text-[10px] px-1.5 py-0">
                          {selectedAgent.licenseStatus}
                        </Badge>
                      )}
                      {selectedAgent.licenseExpiration && (
                        <span className="text-xs text-slate-400">
                          Exp: {new Date(selectedAgent.licenseExpiration).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400">MLS ID</p>
                    <p className="font-medium">{selectedAgent.mlsNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Hire Date</p>
                    <p className="font-medium">{new Date(selectedAgent.hireDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Status</p>
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
                      <li key={c.id} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded border">
                        <span>{c.module?.title || "Unknown Module"}</span>
                        <Badge variant="outline" className="bg-brand-green/10 text-brand-green border-brand-green/30">Completed</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No training completed yet.</p>
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
                      <li key={ack.id} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded border">
                        <span>{ack.document?.title || "Unknown Document"}</span>
                        <span className="text-slate-400 text-xs">{new Date(ack.ackedAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No documents acknowledged yet.</p>
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
                      <li key={req.id} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded border">
                        <span>{req.quantity}x {req.itemType}</span>
                        <Badge variant="outline">{req.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 italic">No supply requests.</p>
                )}
              </div>

              {/* Delete Agent Section */}
              <div className="pt-6 mt-6 border-t border-red-100 flex flex-col items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-red-600 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Danger Zone
                  </h3>
                  <p className="text-sm text-slate-400">
                    Deleting an agent will permanently remove their profile, training history, and document acknowledgements.
                  </p>
                </div>
                
                <Button variant="destructive" disabled={isPending} onClick={() => setIsDeleteDialogOpen(true)}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  {isPending ? "Deleting..." : "Delete Agent"}
                </Button>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <strong>{selectedAgent.name}</strong>'s account and remove all of their data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isPending}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteAgent(selectedAgent.id)} disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {isPending ? "Deleting..." : "Yes, delete agent"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
