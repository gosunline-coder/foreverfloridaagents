import { getInviteByToken } from "@/app/actions";
import { notFound } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default async function InvitePage({ params }: { params: { token: string } }) {
  const user = await getInviteByToken(params.token);

  if (!user || user.status !== "invited") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-none text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has already been used. Please contact your broker for a new link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-brand-blue/30">
      <header className="px-6 py-4 flex justify-center items-center bg-deep-ocean/90 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10 shadow-sm w-full">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Forever Florida Real Estate" 
            width={300} 
            height={100} 
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
            priority
          />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, {user.name}!</h1>
            <p className="text-gray-500 mt-2">Complete your profile to access your agent dashboard.</p>
          </div>
          
          <Card className="shadow-xl border-slate-200">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-brand-blue" />
                <CardTitle className="text-xl">Agent Profile Setup</CardTitle>
              </div>
              <CardDescription>Please provide your professional credentials.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <OnboardingForm token={params.token} user={user} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
