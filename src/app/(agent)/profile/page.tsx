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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(user.id, formData);
    
    setIsSaving(false);
    
    if (result.success) {
      alert("Profile updated successfully!");
      loginWithUser({
        ...user,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        licenseNumber: formData.get("licenseNumber") as string,
        mlsNumber: formData.get("mlsNumber") as string,
      });
    } else {
      alert("Failed to update profile: " + result.error);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Agent Profile</h1>
        <p className="text-gray-500 mt-2">Manage your contact information and licensing details.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm border-white/10">
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
            <Card className="shadow-sm border-white/10">
              <CardHeader className="bg-white/5 border-b">
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
