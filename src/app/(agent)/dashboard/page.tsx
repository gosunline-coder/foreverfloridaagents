"use client";

import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, PlayCircle, FileText, Package } from "lucide-react";
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
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
  }

  const progressPercent = data.totalModules > 0 ? Math.round((data.completedModules / data.totalModules) * 100) : 0;
  const remainingModules = data.totalModules - data.completedModules;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {user?.name.split(" ")[0]}!</h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your onboarding and business today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Onboarding Progress */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 shadow-2xl bg-white/5 border-white/10 backdrop-blur-xl rounded-[2rem]">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Onboarding Progress</CardTitle>
            <CardDescription className="text-slate-400">You are {progressPercent}% complete with your training.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progressPercent} className="h-3 bg-white/10 [&>div]:bg-brand-blue" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10">
                <CheckCircle2 className="h-6 w-6 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-white">Day 1 Orientation</h4>
                  <p className="text-xs text-slate-400 mt-1">Completed on Oct 12</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-5 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 backdrop-blur-md transition-all hover:bg-brand-blue/20">
                <Circle className="h-6 w-6 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-brand-blue">Remaining Training</h4>
                  <p className="text-xs text-blue-200/80 mt-1">{remainingModules} modules remaining</p>
                  <Button variant="link" className="h-auto p-0 mt-2 text-brand-blue font-semibold text-xs hover:text-white transition-colors">
                    <Link href="/training" className="flex items-center">Continue Training <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats / Info */}
        <Card className="shadow-2xl bg-white/5 border-white/10 backdrop-blur-xl rounded-[2rem]">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">License Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">DBPR License</span>
              <Badge variant="outline" className={data.user?.status === 'active' ? "bg-brand-green/10 text-brand-green border-brand-green/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}>
                {data.user?.status === 'active' ? 'Active' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Number</span>
              <span className="text-sm font-medium">{data.user?.licenseNumber || 'Pending'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">MLS ID</span>
              <span className="text-sm font-medium">{data.user?.mlsNumber || 'Pending'}</span>
            </div>
            <hr className="my-2" />
            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2">Need to update your info?</p>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4 text-white">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/training">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/5 border-white/10 hover:border-brand-blue/50 rounded-[1.5rem] group h-full">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-brand-blue/20 rounded-2xl text-brand-blue group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-brand-blue transition-colors">Training Modules</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Watch videos & guides</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/documents">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/5 border-white/10 hover:border-brand-green/50 rounded-[1.5rem] group h-full">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-brand-green/20 rounded-2xl text-brand-green group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-brand-green transition-colors">Document Library</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Forms & policies</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/supply">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/5 border-white/10 hover:border-orange-400/50 rounded-[1.5rem] group h-full">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400 group-hover:scale-110 transition-transform">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">Request Supplies</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Signs & lockboxes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
