"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Building, GraduationCap, LayoutDashboard, FileText, Wrench, Package, UserCircle, LogOut, Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { ImpersonationBar } from "@/components/ImpersonationBar";
import { redirect } from "next/navigation";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, isUnauthorized, user, logout, clerkLoaded, clerkSignedIn, hasClerkUser, isSyncing } = useAuth();
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
      } else if (!isSignedIn || (user && !["agent", "admin", "superadmin"].includes(user.role))) {
        router.push("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, isUnauthorized, user, router]);

  if (!isLoaded || (!isSignedIn && !isUnauthorized)) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground">
        <div>Loading...</div>
        <div className="text-xs text-slate-400 mt-4 opacity-50">
          isLoaded: {String(isLoaded)} | isSignedIn: {String(isSignedIn)} | role: {user?.role || 'none'}
        </div>
        <div className="text-xs text-slate-400 mt-1 opacity-50">
          clerkLoaded: {String(clerkLoaded)} | clerkSignedIn: {String(clerkSignedIn)} | hasClerkUser: {String(hasClerkUser)} | isSyncing: {String(isSyncing)}
        </div>
      </div>
    );
  }

  // If they are something else completely unrecognized (shouldn't happen but just in case)
  if (user && !["agent", "admin", "superadmin"].includes(user.role)) {
    redirect("/sign-in");
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Training", href: "/training", icon: GraduationCap },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Tools", href: "/tools", icon: Wrench },
    { name: "Supply", href: "/supply", icon: Package },
  ];

  if (user && (user.role === "admin" || user.role === "superadmin")) {
    navItems.push({ name: "Admin Portal", href: "/admin", icon: ShieldCheck });
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden flex-col">
      <ImpersonationBar />
      <div className="flex flex-1 overflow-hidden">
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
                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-black text-white dark:bg-brand-blue' : 'text-slate-900 hover:bg-black/10 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/10 dark:border-white/10">
          <Link href="/profile">
            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${pathname === '/profile' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <Avatar className="h-8 w-8 bg-black/10 dark:bg-white/10">
                <AvatarFallback className="bg-slate-700 text-white">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-black dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-700 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-slate-900 hover:bg-black/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 mt-2" onClick={logout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-[#bde871] via-brand-lime to-[#84cc16] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.05)] dark:bg-none dark:shadow-none dark:bg-[#0f172a] border-b border-border">
          <div className="flex items-center gap-4">
            <Image 
              src={mounted && resolvedTheme === 'dark' ? "/logo.png" : "/logo-dark.png"} 
              alt="Forever Florida Real Estate" 
              width={150} 
              height={40} 
              className="w-auto h-8 object-contain"
            />
            <span className="font-bold text-black dark:text-brand-blue tracking-widest uppercase text-xs">Agent</span>
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
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsMobileMenuOpen(false)}>
              <LogOut className="h-6 w-6" />
            </Button>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-3 py-4 rounded-lg transition-colors ${pathname === item.href ? 'bg-black text-white dark:bg-brand-blue' : 'text-slate-900 hover:bg-black/10 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-white'}`}>
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
    </div>
  );
}
