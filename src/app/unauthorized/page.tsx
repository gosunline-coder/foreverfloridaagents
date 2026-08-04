"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { isLoaded, isSignedIn, isUnauthorized, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If they actually are signed in properly as an agent, send them to dashboard
    if (isLoaded && isSignedIn && !isUnauthorized) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, isUnauthorized, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] p-4">
      <Card className="max-w-md w-full shadow-lg border-red-100 dark:border-red-900/30">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl text-slate-900 dark:text-white">Access Denied</CardTitle>
          <CardDescription className="text-base mt-2">
            You are signed in with a recognized email address, but we could not find an active Agent Profile associated with this account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-slate-600 dark:text-slate-400 pt-4">
          <p>
            If you are a new agent, please ensure you have completed the onboarding wizard using the invite link sent to your email by the administrator. 
          </p>
          <p className="mt-4">
            If you believe this is an error, please contact your broker.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4">
          <Button onClick={logout} className="w-full bg-brand-blue hover:bg-blue-700 text-white font-semibold h-11">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
