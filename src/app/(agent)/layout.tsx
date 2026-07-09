"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Building, GraduationCap, LayoutDashboard, FileText, Wrench, Package, UserCircle, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 text-white">
          <Building className="h-6 w-6 text-blue-400" />
          <span className="font-bold text-lg tracking-tight">Forever Florida</span>
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

        <div className="p-4 border-t border-slate-800">
          <Link href="/profile">
            <div className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${pathname === '/profile' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Avatar className="h-8 w-8 bg-slate-700">
                <AvatarFallback className="bg-slate-700 text-slate-300">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">{user.name}</span>
                <span className="text-xs text-slate-500 truncate">Agent Profile</span>
              </div>
            </div>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 mt-2" onClick={logout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-brand-blue" />
            <span className="font-bold text-gray-900">Forever Florida</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900 text-slate-300 flex flex-col pt-16">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <LogOut className="h-6 w-6" />
            </Button>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-3 py-4 rounded-lg transition-colors ${pathname === item.href ? 'bg-brand-blue text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                    <item.icon className="h-6 w-6" />
                    <span className="font-medium text-lg">{item.name}</span>
                  </div>
                </Link>
              ))}
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-4 rounded-lg transition-colors ${pathname === '/profile' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                  <UserCircle className="h-6 w-6" />
                  <span className="font-medium text-lg">Profile</span>
                </div>
              </Link>
              <div 
                className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-slate-800 text-red-400 cursor-pointer"
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
