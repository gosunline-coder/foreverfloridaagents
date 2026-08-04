"use client";

import { useUser } from "./AuthProvider";
import { Button } from "./ui/button";

export function ImpersonationBar() {
  const { isImpersonating, user, stopImpersonating } = useUser();

  if (!isImpersonating) return null;

  return (
    <div className="bg-red-500 text-white px-4 py-1 flex items-center justify-center gap-4 text-sm font-medium z-50 relative">
      <span>You are viewing the site as: {user?.name || user?.email} ({user?.role})</span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => {
          stopImpersonating();
          window.location.href = '/admin'; // Force reload to clear states and go back to admin
        }}
        className="h-6 text-xs bg-white text-red-600 hover:bg-slate-100 border-none"
      >
        Exit Impersonation
      </Button>
    </div>
  );
}
