"use client";

import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, PlayCircle, FileText, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {user?.name.split(" ")[0]}!</h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your onboarding and business today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Onboarding Progress */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Onboarding Progress</CardTitle>
            <CardDescription>You are 60% complete with your first-week onboarding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={60} className="h-3" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-xl border bg-slate-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Day 1 Orientation</h4>
                  <p className="text-xs text-slate-500 mt-1">Completed on Oct 12</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50">
                <Circle className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-blue-900">Week 1 Deep Dive</h4>
                  <p className="text-xs text-blue-700 mt-1">2 modules remaining</p>
                  <Button variant="link" className="h-auto p-0 mt-2 text-blue-600 font-semibold text-xs">
                    <Link href="/training" className="flex items-center">Continue Training <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats / Info */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">License Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">DBPR License</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Number</span>
              <span className="text-sm font-medium">SL3456789</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">MLS ID</span>
              <span className="text-sm font-medium">26154321</span>
            </div>
            <hr className="my-2" />
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-2">Need to update your info?</p>
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
        <h2 className="text-xl font-bold tracking-tight mb-4 text-gray-900">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/training">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-blue-300">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Training Modules</h3>
                  <p className="text-xs text-slate-500">Watch videos & guides</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/documents">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-purple-300">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Document Library</h3>
                  <p className="text-xs text-slate-500">Forms & policies</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/supply">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-orange-300">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Request Supplies</h3>
                  <p className="text-xs text-slate-500">Signs & lockboxes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
