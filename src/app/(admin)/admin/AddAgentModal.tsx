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
      const token = await inviteAgent(formData);
      const link = `${window.location.origin}/invite/${token}`;
      setInviteLink(link);
    } catch (error) {
      console.error(error);
      alert("Failed to invite agent.");
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
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
                <strong>Success!</strong> In a real environment, an email would be sent. For now, copy this magic link to test the onboarding flow:
              </div>
              <div className="flex items-center gap-2">
                <Input readOnly value={inviteLink} className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={() => { setIsOpen(false); setInviteLink(null); }} className="w-full mt-4" variant="secondary">
                Close
              </Button>
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
