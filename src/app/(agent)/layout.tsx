"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Building, GraduationCap, LayoutDashboard, FileText, Wrench, Package, UserCircle, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && (!isSignedIn || user?.role !== "agent")) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded || !isSignedIn || user?.role !== "agent") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Training", href: "/training", icon: GraduationCap },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Tools", href: "/tools", icon: Wrench },
    { name: "Supply", href: "/supply", icon: Package },
  ];

  return (
    <div className="flex h-screen bg-deep-ocean bg-gradient-to-b from-ocean-dark to-deep-ocean overflow-hidden dark text-white">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 text-slate-300 transition-all duration-300">
        <div className="p-6 flex items-center justify-center border-b border-white/10">
          <Image 
            src="/logo.png" 
            alt="Forever Florida Real Estate" 
            width={200} 
            height={60} 
            className="w-auto h-12 object-contain drop-shadow-md"
            priority
          />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-blue text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/profile">
            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${pathname === '/profile' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
              <Avatar className="h-8 w-8 bg-white/10">
                <AvatarFallback className="bg-slate-700 text-slate-300">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">{user.name}</span>
                <span className="text-xs text-slate-400 truncate">Agent Profile</span>
              </div>
            </div>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 mt-2" onClick={logout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-ocean-dark border-b border-white/10">
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Forever Florida Real Estate" 
              width={150} 
              height={40} 
              className="w-auto h-8 object-contain"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-ocean-dark/95 backdrop-blur-xl text-slate-300 flex flex-col pt-16">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <LogOut className="h-6 w-6" />
            </Button>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-3 py-4 rounded-lg transition-colors ${pathname === item.href ? 'bg-brand-blue text-white' : 'hover:bg-white/10 hover:text-white'}`}>
                    <item.icon className="h-6 w-6" />
                    <span className="font-medium text-lg">{item.name}</span>
                  </div>
                </Link>
              ))}
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-4 rounded-lg transition-colors ${pathname === '/profile' ? 'bg-white/10 text-white' : 'hover:bg-white/10 hover:text-white'}`}>
                  <UserCircle className="h-6 w-6" />
                  <span className="font-medium text-lg">Profile</span>
                </div>
              </Link>
              <div 
                className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-white/10 text-red-400 cursor-pointer"
                onClick={() => { setIsMobileMenuOpen(false); logout(); }}
              >
                <LogOut className="h-6 w-6" />
                <span className="font-medium text-lg">Logout</span>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
