"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Mail, Package, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { ImpersonationBar } from "@/components/ImpersonationBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, isUnauthorized, user, logout, isImpersonating } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (isUnauthorized) {
        router.push("/unauthorized");
      } else if (!isSignedIn || (user?.role !== "admin" && user?.role !== "superadmin")) {
        router.push("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, isUnauthorized, user, router]);

  if (!isLoaded || (!isSignedIn && !isUnauthorized) || (user?.role !== "admin" && user?.role !== "superadmin")) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
        <div>Loading admin portal...</div>
        <div className="text-xs text-slate-400 mt-4 opacity-50">
          isLoaded: {String(isLoaded)} | isSignedIn: {String(isSignedIn)} | isUnauthorized: {String(isUnauthorized)} | role: {user?.role || 'none'} | impersonated: {String(isImpersonating)}
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Admin Dashboard", href: "/admin", icon: Users },
    { name: "Manage Admins", href: "/admin/management", icon: ShieldCheck },
    { name: "Recruiting Inquiries", href: "/admin/inquiries", icon: Mail },
    { name: "Supply Management", href: "/admin/supply", icon: Package },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-50">
        <ImpersonationBar />
      </div>
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-[#bde871] via-brand-lime to-[#84cc16] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.05)] dark:bg-none dark:shadow-none dark:bg-white/5 backdrop-blur-xl border-r border-border transition-all duration-300">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <Image 
            src={mounted && resolvedTheme === 'dark' ? "/logo.png" : "/logo-dark.png"} 
            alt="Forever Florida Real Estate" 
            width={200} 
            height={60} 
            className="w-auto h-12 object-contain drop-shadow-md"
            priority
          />
          <ThemeToggle />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-black text-white dark:bg-brand-green' : 'text-slate-900 hover:bg-black/10 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-slate-900 hover:bg-black/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5" onClick={logout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-8">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-[#bde871] via-brand-lime to-[#84cc16] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.05)] dark:bg-none dark:shadow-none dark:bg-ocean-dark border-b border-border">
          <div className="flex items-center gap-4">
            <Image 
              src={mounted && resolvedTheme === 'dark' ? "/logo.png" : "/logo-dark.png"} 
              alt="Forever Florida Real Estate" 
              width={150} 
              height={40} 
              className="w-auto h-8 object-contain"
            />
            <span className="font-bold text-black dark:text-brand-green tracking-widest uppercase text-xs">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col pt-16">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <LogOut className="h-6 w-6" />
            </Button>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-3 py-4 rounded-lg transition-colors ${pathname === item.href ? 'bg-black text-white dark:bg-brand-green' : 'text-slate-900 hover:bg-black/10 dark:hover:bg-white/10 dark:text-white dark:hover:text-white'}`}>
                    <item.icon className="h-6 w-6" />
                    <span className="font-medium text-lg">{item.name}</span>
                  </div>
                </Link>
              ))}
              <div 
                className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-red-500 dark:text-red-400 cursor-pointer mt-auto"
                onClick={() => { setIsMobileMenuOpen(false); logout(); }}
              >
                <LogOut className="h-6 w-6" />
                <span className="font-medium text-lg">Logout</span>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans">
          {children}
        </main>
      </div>
    </div>
  );
}
