"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, isSignedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isSignedIn, user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Building className="h-6 w-6 text-brand-blue" />
        <span className="text-xl font-bold tracking-tight text-gray-900">Forever Florida</span>
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Select a role to continue (Mock Auth)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button 
            className="w-full h-16 text-lg justify-start px-6 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-200" 
            variant="outline"
            onClick={() => login("agent")}
          >
            <User className="mr-4 h-6 w-6 text-blue-500" />
            <div className="text-left flex flex-col">
              <span className="font-semibold">Agent</span>
              <span className="text-xs font-normal text-slate-500">Access dashboard and training</span>
            </div>
          </Button>

          <Button 
            className="w-full h-16 text-lg justify-start px-6 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-900" 
            onClick={() => login("admin")}
          >
            <ShieldCheck className="mr-4 h-6 w-6 text-brand-green" />
            <div className="text-left flex flex-col">
              <span className="font-semibold">Admin</span>
              <span className="text-xs font-normal text-slate-400">Access reports and audits</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
