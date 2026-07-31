"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inviteAgent } from "@/app/actions";
import { UserPlus, Copy, Check } from "lucide-react";

export function AddAgentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await inviteAgent(formData);
      if (result.success) {
        const link = `${window.location.origin}/invite/${result.token}`;
        setInviteLink(link);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred while communicating with the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
        <UserPlus className="mr-2 h-4 w-4" /> Add Agent
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader>
          <CardTitle>Invite New Agent</CardTitle>
          <CardDescription>Enter their details to generate an onboarding link.</CardDescription>
        </CardHeader>
        <CardContent>
          {inviteLink ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Invitation Sent!</h3>
              <p className="text-slate-500 text-sm">
                An email has been successfully dispatched to the agent with their personalized onboarding link.
              </p>
              
              {/* Fallback for development if the user hasn't put the RESEND_API_KEY in their .env yet */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                <p className="mb-2">Developing locally without an API key? You can manually use this link:</p>
                <div className="flex gap-2 items-center">
                  <Input readOnly value={inviteLink} className="bg-slate-50 h-8 text-xs" />
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={() => { setIsOpen(false); setInviteLink(null); }} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input name="name" required placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" required placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input name="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={isSubmitting}>
                  {isSubmitting ? "Generating..." : "Generate Invite"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
