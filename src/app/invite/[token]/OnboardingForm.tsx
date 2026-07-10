"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeOnboarding } from "@/app/actions";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

export function OnboardingForm({ token, user }: { token: string, user: User }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const updatedUser = await completeOnboarding(token, formData);
      
      // Update the auth context to mock-log in the user using DB data
      if (loginWithUser) {
        loginWithUser({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role as 'agent' | 'admin',
        });
      }
      
      // Redirect to the agent dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to complete onboarding.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input readOnly value={user.name} className="bg-slate-50 text-slate-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input readOnly value={user.email} className="bg-slate-50 text-slate-500" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">MLS Number <span className="text-red-500">*</span></label>
          <Input name="mlsNumber" required placeholder="STE123456" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Real Estate License Number <span className="text-red-500">*</span></label>
          <Input name="licenseNumber" required placeholder="SL1234567" />
        </div>
      </div>

      <div className="pt-6 border-t mt-6">
        <Button type="submit" size="lg" className="w-full bg-brand-blue hover:bg-brand-blue/90 h-14 text-lg" disabled={isSubmitting}>
          {isSubmitting ? "Activating Profile..." : "Complete Profile & Login"}
        </Button>
      </div>
    </form>
  );
}
