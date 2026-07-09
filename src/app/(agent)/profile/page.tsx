"use client";

import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Agent Profile</h1>
        <p className="text-gray-500 mt-2">Manage your contact information and licensing details.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 bg-blue-100 text-brand-blue">
                <AvatarFallback className="text-3xl font-bold">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                Agent
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Update your public-facing details.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input defaultValue={user.email} type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input defaultValue="(727) 555-0123" type="tel" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 mt-6">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg">Licensing & DBPR</CardTitle>
                <CardDescription>Your official state real estate license details.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">License Number</label>
                    <Input defaultValue="SL3456789" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">MLS Agent ID</label>
                    <Input defaultValue="26154321" />
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
