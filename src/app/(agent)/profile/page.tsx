"use client";

import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { updateProfile } from "@/app/actions/agent";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, loginWithUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [driversLicenseFile, setDriversLicenseFile] = useState<File | null>(null);
  const [autoInsuranceFile, setAutoInsuranceFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter(file);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    if (driversLicenseFile) formData.append("driversLicense", driversLicenseFile);
    if (autoInsuranceFile) formData.append("autoInsurance", autoInsuranceFile);
    
    const result = await updateProfile(formData);
    
    setIsSaving(false);
    
    if (result.success) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile: " + result.error);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Agent Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your contact information and licensing details.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm border-border bg-card">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 bg-brand-blue/20 text-brand-blue">
                <AvatarFallback className="text-3xl font-bold">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <div className="mt-4 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-semibold">
                Agent
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            <Card className="shadow-sm border-border">
              <CardHeader className="bg-muted border-b border-border">
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Update your public-facing details.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input name="name" defaultValue={user.name} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input name="email" defaultValue={user.email} type="email" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input name="phone" defaultValue={user.phone || ""} type="tel" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Street Address</label>
                    <Input name="address" defaultValue={user.address || ""} placeholder="123 Main St" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input name="city" defaultValue={user.city || ""} placeholder="Orlando" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Input name="state" defaultValue={user.state || ""} placeholder="FL" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Zip</label>
                      <Input name="zip" defaultValue={user.zip || ""} placeholder="32801" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-white/10 mt-6">
              <CardHeader className="bg-white/5 border-b">
                <CardTitle className="text-lg">Licensing & DBPR</CardTitle>
                <CardDescription>Your official state real estate license details.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">License Number</label>
                    <div className="flex gap-2">
                      <Input name="licenseNumber" defaultValue={user.licenseNumber || ""} className="flex-1" placeholder="e.g. SL3350267" />
                    </div>
                    {user.licenseStatus ? (
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={user.licenseStatus.includes("Active") ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/30" : "bg-red-400/10 text-red-400 border-red-400/30"}>
                            {user.licenseStatus}
                          </Badge>
                          {user.licenseExpiration && (
                            <span className="text-xs text-slate-400">
                              Exp: {new Date(user.licenseExpiration).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {user.lastVerifiedAt && (
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Verified by Admin on {new Date(user.lastVerifiedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-500 mt-2">Pending Admin Verification</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">MLS Agent ID</label>
                    <Input name="mlsNumber" defaultValue={user.mlsNumber || ""} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border bg-card mt-6">
              <CardHeader className="bg-muted border-b border-border">
                <CardTitle className="text-lg">Credentials & Documents</CardTitle>
                <CardDescription>Upload copies of your required credentials.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Driver's License</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <Input 
                          type="file" 
                          accept="image/*,.pdf"
                          onChange={e => handleFileUpload(e, setDriversLicenseFile)}
                        />
                        {driversLicenseFile && <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" />}
                      </div>
                      {user.driversLicense && !driversLicenseFile && (
                        <div className="flex items-center gap-2 text-sm text-brand-blue">
                          <CheckCircle2 className="w-4 h-4" />
                          <a href={`/api/documents?url=${encodeURIComponent(user.driversLicense)}`} target="_blank" rel="noreferrer" className="hover:underline">View Document on File</a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Auto Insurance</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <Input 
                          type="file" 
                          accept="image/*,.pdf"
                          onChange={e => handleFileUpload(e, setAutoInsuranceFile)}
                        />
                        {autoInsuranceFile && <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" />}
                      </div>
                      {user.autoInsurance && !autoInsuranceFile && (
                        <div className="flex items-center gap-2 text-sm text-brand-blue">
                          <CheckCircle2 className="w-4 h-4" />
                          <a href={`/api/documents?url=${encodeURIComponent(user.autoInsurance)}`} target="_blank" rel="noreferrer" className="hover:underline">View Document on File</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
              <Button type="submit" className="bg-brand-blue hover:bg-blue-700" disabled={isSaving}>
                {isSaving ? "Saving..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
