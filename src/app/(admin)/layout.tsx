"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Mail, Package, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && (!isSignedIn || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded || !isSignedIn || user?.role !== "admin") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const navItems = [
    { name: "Admin Dashboard", href: "/admin", icon: Users },
    { name: "Recruiting Inquiries", href: "/admin/inquiries", icon: Mail },
    { name: "Supply Management", href: "/admin/supply", icon: Package },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-300 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 text-white">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          <span className="font-bold text-lg tracking-tight">Admin Portal</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'hover:bg-slate-900 hover:text-white'}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900 mt-2" onClick={logout}>
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
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-gray-900">Admin Portal</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-950 text-slate-300 flex flex-col pt-16">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <LogOut className="h-6 w-6" />
            </Button>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-3 py-4 rounded-lg transition-colors ${pathname === item.href ? 'bg-emerald-600 text-white' : 'hover:bg-slate-900 hover:text-white'}`}>
                    <item.icon className="h-6 w-6" />
                    <span className="font-medium text-lg">{item.name}</span>
                  </div>
                </Link>
              ))}
              <div 
                className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-slate-900 text-red-400 cursor-pointer"
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
