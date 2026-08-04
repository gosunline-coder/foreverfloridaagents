"use client";

import { useUser } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export function ImpersonateButton({ userId, userRole }: { userId: string, userRole: string }) {
  const { realUser, impersonate } = useUser();
  const router = useRouter();

  if (realUser?.role !== 'superadmin') return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 h-8 text-xs bg-muted hover:bg-slate-200 dark:hover:bg-slate-800"
      onClick={(e) => {
        e.stopPropagation();
        impersonate(userId);
        if (userRole === 'agent') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/admin';
        }
      }}
    >
      <Eye className="w-3 h-3 mr-1" />
      View As
    </Button>
  );
}
