"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ShieldCheck, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { syncMockUser } from "@/app/actions/agent";

export default function LoginPage() {
  const { loginWithUser, isSignedIn, user } = useAuth();
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isSignedIn, user, router]);

  const handleLogin = async (role: "agent" | "admin") => {
    setLoggingIn(true);
    const mockUser = {
      id: role === 'admin' ? 'user_admin123' : 'user_agent456',
      name: role === 'admin' ? 'Everett Admin' : 'Agent Smith',
      email: role === 'admin' ? 'everett@foreverflorida.com' : 'smith@agent.com',
      role: role,
    };
    
    // Ensure the mock user exists in the database
    await syncMockUser(mockUser);
    
    loginWithUser(mockUser as any);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ocean-dark relative overflow-hidden p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-green/10 blur-[120px]" />
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-3 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
          <Building className="h-6 w-6 text-brand-green" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Forever Florida</span>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-white mb-2">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Select your role to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Button 
            className="w-full h-[72px] text-lg justify-start px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-brand-blue/50 transition-all duration-300 group" 
            variant="outline"
            onClick={() => handleLogin("agent")}
            disabled={loggingIn}
          >
            <div className="h-10 w-10 rounded-full bg-brand-blue/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              {loggingIn ? <Loader2 className="h-5 w-5 text-brand-blue animate-spin" /> : <User className="h-5 w-5 text-brand-blue" />}
            </div>
            <div className="text-left flex flex-col">
              <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">Agent Portal</span>
              <span className="text-xs font-normal text-slate-400">Access dashboard and training</span>
            </div>
          </Button>

          <Button 
            className="w-full h-[72px] text-lg justify-start px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-brand-green/50 transition-all duration-300 group" 
            variant="outline"
            onClick={() => handleLogin("admin")}
            disabled={loggingIn}
          >
            <div className="h-10 w-10 rounded-full bg-brand-green/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              {loggingIn ? <Loader2 className="h-5 w-5 text-brand-green animate-spin" /> : <ShieldCheck className="h-5 w-5 text-brand-green" />}
            </div>
            <div className="text-left flex flex-col">
              <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">Admin Portal</span>
              <span className="text-xs font-normal text-slate-400">Access reports and audits</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
