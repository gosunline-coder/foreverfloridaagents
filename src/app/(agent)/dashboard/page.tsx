"use client";

import { useAuth } from "@/components/AuthProvider";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, PlayCircle, FileText, Package, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getDashboardData } from "@/app/actions/agent";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    user: any;
    totalModules: number;
    completedModules: number;
  } | null>(null);

  useEffect(() => {
    if (user?.id) {
      getDashboardData(user.id).then(setData);
    }
  }, [user]);

  if (!data) {
    return <div className="p-8 text-center text-slate-400 animate-pulse">Loading dashboard...</div>;
  }

  const progressPercent = data.totalModules > 0 ? Math.round((data.completedModules / data.totalModules) * 100) : 0;
  const isFullyOnboarded = progressPercent === 100;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12 pt-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Welcome, {user?.name.split(" ")[0]}
          </h1>
          <p className="text-lg text-slate-400 font-light">Here's your business overview for today.</p>
        </div>
        
        {/* Status Pill */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-full shadow-lg">
          <div className={`h-2.5 w-2.5 rounded-full ${data.user?.status === 'active' ? 'bg-brand-green animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-amber-400'}`} />
          <span className="text-sm font-medium text-slate-200">
            {data.user?.status === 'active' ? 'License Active' : 'License Pending'}
          </span>
          <span className="text-xs text-slate-500 pl-3 ml-1 border-l border-white/10">MLS: {data.user?.mlsNumber || 'N/A'}</span>
        </div>
      </div>

      {/* Massive Onboarding Progress */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-8 md:p-12 backdrop-blur-2xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:items-center justify-between">
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Onboarding Progress</h2>
            <p className="text-slate-400 mb-8 max-w-xl text-lg font-light leading-relaxed">
              {isFullyOnboarded 
                ? "You've successfully completed all training modules! You are ready to start selling." 
                : "Complete your training modules to unlock your full agent potential and get your license activated."}
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <span className="text-5xl font-extrabold text-white tracking-tighter">{progressPercent}%</span>
                {isFullyOnboarded && (
                  <span className="flex items-center text-brand-green font-medium text-lg">
                    <CheckCircle2 className="w-6 h-6 mr-2" /> All Done!
                  </span>
                )}
              </div>
              <Progress value={progressPercent} className="h-6 rounded-full bg-white/10 [&>div]:bg-brand-blue shadow-inner" />
            </div>
          </div>
          
          {!isFullyOnboarded && (
            <div className="shrink-0 flex items-center justify-center lg:pl-10">
              <Link href="/training">
                <Button size="lg" className="h-16 px-10 rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_50px_-5px_rgba(59,130,246,0.8)]">
                  Resume Training <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Vibrant Quick Links */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-white mb-6 pl-2">Quick Actions</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/training" className="group">
            <div className="h-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-brand-blue/40 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.2)]">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:scale-110 transition-all duration-500">
                <PlayCircle className="w-8 h-8 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Training</h4>
              <p className="text-slate-400 font-light text-lg">Access orientation, marketing guides, and sales strategies.</p>
            </div>
          </Link>
          
          <Link href="/documents" className="group">
            <div className="h-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-brand-green/40 hover:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.2)]">
              <div className="w-16 h-16 rounded-2xl bg-brand-green/20 flex items-center justify-center mb-6 group-hover:bg-brand-green group-hover:scale-110 transition-all duration-500">
                <FileText className="w-8 h-8 text-brand-green group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Documents</h4>
              <p className="text-slate-400 font-light text-lg">Find W9s, blank contracts, and compliance forms.</p>
            </div>
          </Link>

          <Link href="/supply" className="group">
            <div className="h-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.2)]">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-500">
                <Package className="w-8 h-8 text-orange-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Supplies</h4>
              <p className="text-slate-400 font-light text-lg">Order yard signs, lockboxes, and business cards.</p>
            </div>
          </Link>
        </div>
      </div>
      
    </div>
  );
}
