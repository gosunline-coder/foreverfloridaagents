"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, X, BookOpen, FileCheck, Package, Trash2, Loader2, AlertCircle, ShieldCheck, Edit2 } from "lucide-react";
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
import { deleteAgent, verifyAgentLicense, updateAgentBasicInfo } from "@/app/actions/admin";
import { makeAdmin, revokeAdmin } from "@/app/actions/management";
import { Input } from "@/components/ui/input";

type AgentData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  licenseNumber: string | null;
  licenseStatus: string | null;
  licenseExpiration: Date | null;
  lastVerifiedAt: Date | null;
  mlsNumber: string | null;
  driversLicense?: string | null;
  autoInsurance?: string | null;
  status: string;
  role: string;
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
  
  // Verification states
  const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState("Active");
  const [verifyDate, setVerifyDate] = useState("");
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);
  const [isTogglingAdmin, setIsTogglingAdmin] = useState(false);
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", mlsNumber: "", address: "", city: "", state: "", zip: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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

  const handleVerifySubmit = async () => {
    if (!selectedAgent) return;
    setIsSubmittingVerify(true);
    const expDate = verifyDate ? new Date(verifyDate) : null;
    const res = await verifyAgentLicense(selectedAgent.id, verifyStatus, expDate);
    setIsSubmittingVerify(false);
    
    if (res.success) {
      setIsVerifyingLicense(false);
      // Update local state to avoid full refresh immediately
      setSelectedAgent({
        ...selectedAgent,
        licenseStatus: verifyStatus,
        licenseExpiration: expDate,
        lastVerifiedAt: new Date()
      });
      router.refresh();
    } else {
      alert("Failed to verify license.");
    }
  };

  const handleEditProfileSave = async () => {
    if (!selectedAgent) return;
    setIsSavingProfile(true);
    const res = await updateAgentBasicInfo(selectedAgent.id, {
      name: editForm.name,
      phone: editForm.phone,
      mlsNumber: editForm.mlsNumber,
      email: selectedAgent.email, // email is read-only for now
      address: editForm.address,
      city: editForm.city,
      state: editForm.state,
      zip: editForm.zip,
    });
    setIsSavingProfile(false);
    
    if (res.success) {
      setIsEditingProfile(false);
      setSelectedAgent({
        ...selectedAgent,
        name: editForm.name,
        phone: editForm.phone,
        mlsNumber: editForm.mlsNumber,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        zip: editForm.zip,
      });
      router.refresh();
    } else {
      alert(res.error || "Failed to save profile");
    }
  };

  const handleToggleAdmin = async () => {
    if (!selectedAgent) return;
    const isCurrentlyAdmin = selectedAgent.role === "admin" || selectedAgent.role === "superadmin";
    
    if (selectedAgent.role === "superadmin") {
      alert("Cannot modify superadmin privileges.");
      return;
    }

    if (isCurrentlyAdmin && !confirm("Are you sure you want to revoke admin access for this user?")) return;
    if (!isCurrentlyAdmin && !confirm("Are you sure you want to grant admin access to this user?")) return;

    setIsTogglingAdmin(true);
    try {
      if (isCurrentlyAdmin) {
        await revokeAdmin(selectedAgent.id);
        setSelectedAgent({ ...selectedAgent, role: "agent" });
      } else {
        await makeAdmin(selectedAgent.id);
        setSelectedAgent({ ...selectedAgent, role: "admin" });
      }
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to update role");
    } finally {
      setIsTogglingAdmin(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
      case "Onboarding": return "bg-orange-400/10 text-orange-400 border-orange-400/30";
      case "Overdue": return "bg-red-400/10 text-red-400 border-red-400/30";
      case "Invited": default: return "bg-cyan-400/10 text-cyan-400 border-cyan-400/30";
    }
  };

  const getDBPRStatusColor = (status: string | null) => {
    if (!status) return "bg-slate-400/10 text-slate-400 border-slate-400/30";
    if (status.includes("Delinquent, Active")) return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
    if (status.includes("Active")) return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
    return "bg-red-400/10 text-red-400 border-red-400/30";
  };

  return (
    <>
      <Card className="col-span-1 md:col-span-2 shadow-sm border-border bg-card">
        <CardHeader className="bg-muted border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg text-foreground">Agent Onboarding & Roster</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Track onboarding progress and license numbers. Click any row for details.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-border">
                <TableHead className="pl-6 text-muted-foreground">Agent Name</TableHead>
                <TableHead className="text-muted-foreground">License #</TableHead>
                <TableHead className="text-muted-foreground">DBPR Status</TableHead>
                <TableHead className="text-muted-foreground">MLS ID</TableHead>
                <TableHead className="text-muted-foreground">Onboarding</TableHead>
                <TableHead className="text-muted-foreground">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const progress = totalModules > 0 ? Math.round((agent.completions.length / totalModules) * 100) : 0;
                
                return (
                  <TableRow 
                    key={agent.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors border-border"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <TableCell className="pl-6 font-medium text-foreground">{agent.name}</TableCell>
                    <TableCell className="text-muted-foreground">{agent.licenseNumber || "Pending"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {agent.licenseStatus ? (
                          <Badge variant="outline" className={getDBPRStatusColor(agent.licenseStatus)}>
                            {agent.licenseStatus}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unverified</span>
                        )}
                        {agent.licenseExpiration && (() => {
                          const expDate = new Date(agent.licenseExpiration);
                          expDate.setHours(0, 0, 0, 0);
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);
                          const diff = expDate.getTime() - now.getTime();
                          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                          if (days <= 60) {
                            return (
                              <span title={`Expires in ${days} days`}>
                                <AlertCircle 
                                  className={`h-4 w-4 ${days <= 30 ? 'text-red-400' : 'text-amber-400'}`} 
                                />
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{agent.mlsNumber || "Pending"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{progress}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Slide-out Modal for Agent Details */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/80 dark:bg-black/80 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-200">
          <Card className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl overflow-y-auto shadow-2xl bg-card border-l border-border animate-in slide-in-from-right-1/2 duration-300">
            <CardHeader className="sticky top-0 bg-muted z-10 border-b border-border flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="w-full mr-4">
                  {isEditingProfile ? (
                    <div className="space-y-2">
                      <Input 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                        placeholder="Agent Name"
                        className="font-bold text-lg h-8"
                      />
                      <Input 
                        value={editForm.phone} 
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
                        placeholder="Phone Number"
                        className="h-8"
                      />
                      <Input 
                        value={editForm.address} 
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})} 
                        placeholder="Address"
                        className="h-8"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input 
                          value={editForm.city} 
                          onChange={(e) => setEditForm({...editForm, city: e.target.value})} 
                          placeholder="City"
                          className="h-8 col-span-1"
                        />
                        <Input 
                          value={editForm.state} 
                          onChange={(e) => setEditForm({...editForm, state: e.target.value})} 
                          placeholder="State"
                          className="h-8 col-span-1"
                        />
                        <Input 
                          value={editForm.zip} 
                          onChange={(e) => setEditForm({...editForm, zip: e.target.value})} 
                          placeholder="Zip"
                          className="h-8 col-span-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-foreground">{selectedAgent.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-muted-foreground/10"
                          title="Edit Profile"
                          onClick={() => {
                            setEditForm({ 
                              name: selectedAgent.name, 
                              phone: selectedAgent.phone || "", 
                              mlsNumber: selectedAgent.mlsNumber || "",
                              address: selectedAgent.address || "",
                              city: selectedAgent.city || "",
                              state: selectedAgent.state || "",
                              zip: selectedAgent.zip || "",
                            });
                            setIsEditingProfile(true);
                          }}
                        >
                          <Edit2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-2 h-7 px-3 text-xs"
                          onClick={() => window.open(`/api/admin/agent-export/${selectedAgent.id}`, '_blank')}
                        >
                          <FileCheck className="h-3 w-3 mr-1" /> Download record
                        </Button>
                      </div>
                      <CardDescription className="text-muted-foreground">
                        {selectedAgent.email} • {selectedAgent.phone || "No phone"}
                        {selectedAgent.address && (
                          <> • {selectedAgent.address}, {selectedAgent.city}, {selectedAgent.state} {selectedAgent.zip}</>
                        )}
                      </CardDescription>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 hover:bg-muted-foreground/10 rounded-full transition-colors self-end"
                >
                  <X className="h-5 w-5 text-slate-400" />
                </button>
                {isEditingProfile && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleEditProfileSave} disabled={isSavingProfile}>
                      {isSavingProfile ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Profile Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                  <Users className="h-4 w-4 text-muted-foreground" /> Credentials
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="col-span-2">
                    <p className="text-muted-foreground">License Number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium text-foreground">{selectedAgent.licenseNumber || "Not provided"}</p>
                      {selectedAgent.licenseStatus && (
                        <Badge variant="outline" className={`${getDBPRStatusColor(selectedAgent.licenseStatus)} text-[10px] px-1.5 py-0`}>
                          {selectedAgent.licenseStatus}
                        </Badge>
                      )}
                      {selectedAgent.licenseExpiration && (
                        <span className="text-xs text-muted-foreground">
                          Exp: {new Date(selectedAgent.licenseExpiration).toLocaleDateString()}
                        </span>
                      )}
                      
                      {!isVerifyingLicense && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs px-2 ml-2" 
                          onClick={() => {
                            if (selectedAgent.licenseNumber) {
                              window.open(`https://www.myfloridalicense.com/wl11.asp?mode=0&search=LicNbr`, '_blank');
                            }
                            setIsVerifyingLicense(true);
                            setVerifyStatus(selectedAgent.licenseStatus || "Active");
                            setVerifyDate(selectedAgent.licenseExpiration ? new Date(selectedAgent.licenseExpiration).toISOString().split('T')[0] : "");
                          }}
                        >
                          Verify
                        </Button>
                      )}
                    </div>

                    {isVerifyingLicense && (
                      <div className="mt-3 p-3 bg-background rounded border border-border space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Status</label>
                            <select 
                              className="flex h-9 w-full rounded-md border border-border bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue text-foreground"
                              value={verifyStatus}
                              onChange={(e) => setVerifyStatus(e.target.value)}
                            >
                              <option value="Active">Active</option>
                              <option value="Current, Active">Current, Active</option>
                              <option value="Delinquent, Active">Delinquent, Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Probation">Probation</option>
                              <option value="Null and Void">Null and Void</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Expiration Date</label>
                            <Input 
                              type="date" 
                              value={verifyDate} 
                              onChange={(e) => setVerifyDate(e.target.value)} 
                              className="h-9 bg-card border-border text-foreground"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => setIsVerifyingLicense(false)}>Cancel</Button>
                          <Button size="sm" className="bg-brand-blue hover:bg-blue-600" onClick={handleVerifySubmit} disabled={isSubmittingVerify}>
                            {isSubmittingVerify ? "Saving..." : "Save Verification"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">MLS ID</p>
                    {isEditingProfile ? (
                      <Input 
                        value={editForm.mlsNumber} 
                        onChange={(e) => setEditForm({...editForm, mlsNumber: e.target.value})} 
                        placeholder="MLS Number"
                        className="mt-1 h-8"
                      />
                    ) : (
                      <p className="font-medium mt-1 text-foreground">{selectedAgent.mlsNumber || "Pending"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hire Date</p>
                    <p className="font-medium text-foreground">{new Date(selectedAgent.hireDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant="outline" className={getStatusColor(selectedAgent.status)}>
                      {selectedAgent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents section */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                  <FileCheck className="h-4 w-4 text-muted-foreground" /> Uploaded Documents
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-muted-foreground mb-2">Driver's License</p>
                    {selectedAgent.driversLicense ? (
                      <a href={`/api/documents?url=${encodeURIComponent(selectedAgent.driversLicense)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-blue hover:underline">
                        View Document
                      </a>
                    ) : (
                      <p className="font-medium text-foreground italic">Not uploaded</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">Auto Insurance</p>
                    {selectedAgent.autoInsurance ? (
                      <a href={`/api/documents?url=${encodeURIComponent(selectedAgent.autoInsurance)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-blue hover:underline">
                        View Document
                      </a>
                    ) : (
                      <p className="font-medium text-foreground italic">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Training Progress */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                  <BookOpen className="h-4 w-4 text-muted-foreground" /> Training Modules ({selectedAgent.completions.length}/{totalModules})
                </h3>
                {selectedAgent.completions.length > 0 ? (
                  <ul className="space-y-2 text-sm text-foreground">
                    {selectedAgent.completions.map(c => (
                      <li key={c.id} className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded border border-border">
                        <span>{c.module?.title || "Unknown Module"}</span>
                        <Badge variant="outline" className="bg-brand-green/10 text-brand-green border-brand-green/30">Completed</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No training completed yet.</p>
                )}
              </div>

              {/* Document Acknowledgments */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                  <FileCheck className="h-4 w-4 text-muted-foreground" /> Documents Acknowledged ({selectedAgent.docAcks.length}/{totalDocs})
                </h3>
                {selectedAgent.docAcks.length > 0 ? (
                  <ul className="space-y-2 text-sm text-foreground">
                    {selectedAgent.docAcks.map(ack => (
                      <li key={ack.id} className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded border border-border">
                        <span>{ack.document?.title || "Unknown Document"}</span>
                        <span className="text-muted-foreground text-xs">{new Date(ack.ackedAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No documents acknowledged yet.</p>
                )}
              </div>

              {/* Supply Requests */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
                  <Package className="h-4 w-4 text-muted-foreground" /> Supply Requests
                </h3>
                {selectedAgent.supplyRequests.length > 0 ? (
                  <ul className="space-y-2 text-sm text-foreground">
                    {selectedAgent.supplyRequests.map(req => (
                      <li key={req.id} className="flex justify-between items-center bg-muted/50 px-3 py-2 rounded border border-border">
                        <span>{req.quantity}x {req.itemType}</span>
                        <Badge variant="outline">{req.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No supply requests.</p>
                )}
              </div>

              {/* Admin Privileges Section */}
              <div className="pt-6 mt-6 border-t border-border flex flex-col items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-blue" /> Administrative Privileges
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Grant this user access to the Admin Portal to manage other agents and inventory.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border w-full sm:justify-between overflow-hidden">
                  <div className="w-full sm:w-auto">
                    <p className="font-medium text-foreground">Admin Access</p>
                    <p className="text-xs text-muted-foreground">
                      Currently: {selectedAgent.role === 'admin' || selectedAgent.role === 'superadmin' ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Button 
                    variant={selectedAgent.role === 'admin' || selectedAgent.role === 'superadmin' ? 'destructive' : 'default'} 
                    size="sm"
                    onClick={handleToggleAdmin}
                    disabled={isTogglingAdmin || selectedAgent.role === 'superadmin'}
                    className={`w-full sm:w-auto shrink-0 ${selectedAgent.role === 'agent' ? "bg-brand-blue hover:bg-brand-blue/90" : ""}`}
                  >
                    {isTogglingAdmin ? "Updating..." : (selectedAgent.role === 'admin' || selectedAgent.role === 'superadmin' ? "Revoke Access" : "Make Admin")}
                  </Button>
                </div>
              </div>

              {/* Delete Agent Section */}
              <div className="pt-6 mt-6 border-t border-red-100 flex flex-col items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-red-600 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Danger Zone
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
