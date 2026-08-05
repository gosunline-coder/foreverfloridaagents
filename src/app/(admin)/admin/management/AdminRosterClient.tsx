"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImpersonateButton } from "@/components/ImpersonateButton";
import { Button } from "@/components/ui/button";
import { revokeAdmin } from "@/app/actions/management";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminRosterClient({ admins }: { admins: any[] }) {
  const router = useRouter();
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  if (admins.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">No administrators found.</p>;
  }

  const handleRevoke = async (adminId: string) => {
    if (!confirm("Are you sure you want to revoke this user's admin privileges? They will become a standard agent.")) return;
    
    setIsRevoking(adminId);
    try {
      const result = await revokeAdmin(adminId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to revoke admin.");
    } finally {
      setIsRevoking(null);
    }
  };

  return (
    <div className="space-y-4">
      {admins.map((admin) => (
        <div key={admin.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-brand-blue text-white">
                {admin.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{admin.name}</p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              admin.status === 'active' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
            }`}>
              {admin.status}
            </span>
            <ImpersonateButton userId={admin.id} userRole="admin" />
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => handleRevoke(admin.id)}
              disabled={isRevoking === admin.id}
            >
              {isRevoking === admin.id ? "Revoking..." : "Revoke"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
