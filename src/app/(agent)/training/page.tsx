"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TrainingPage() {
  const [completedDocs, setCompletedDocs] = useState<string[]>(["intro"]);

  const handleComplete = (id: string) => {
    if (!completedDocs.includes(id)) {
      setCompletedDocs([...completedDocs, id]);
    }
  };

  const modules = {
    day1: [
      { id: "intro", title: "Welcome to Forever Florida", duration: "15 min", type: "video" },
      { id: "tools-setup", title: "Setting up your Tools", duration: "30 min", type: "video" },
      { id: "policy-ack", title: "Brokerage Policy Acknowledgment", duration: "5 min", type: "quiz", requiresAck: true },
    ],
    week1: [
      { id: "boldtrail-101", title: "BoldTrail CRM Basics", duration: "45 min", type: "video" },
      { id: "listing-presentation", title: "The Perfect Listing Presentation", duration: "60 min", type: "video" },
    ],
    month1: [
      { id: "marketing-automation", title: "Automating your Marketing", duration: "45 min", type: "video" },
      { id: "farm-building", title: "Building your Farm Area", duration: "50 min", type: "video" },
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Training Modules</h1>
        <p className="text-gray-500 mt-2">Complete these sequences to get up and running smoothly.</p>
      </div>

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="day1">Day 1</TabsTrigger>
          <TabsTrigger value="week1">Week 1</TabsTrigger>
          <TabsTrigger value="month1">Month 1</TabsTrigger>
        </TabsList>
        
        {Object.entries(modules).map(([key, mods]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mods.map((mod) => {
                const isCompleted = completedDocs.includes(mod.id);
                return (
                  <Card key={mod.id} className={`overflow-hidden transition-all ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-300'}`}>
                    <div className="aspect-video bg-slate-900 relative group cursor-pointer flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                      <PlayCircle className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      {isCompleted && (
                        <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg leading-tight">{mod.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">{mod.duration}</Badge>
                        {mod.requiresAck && <Badge variant="destructive" className="text-xs">Requires Ack</Badge>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {!isCompleted ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4"
                          onClick={() => handleComplete(mod.id)}
                        >
                          Mark as Completed
                        </Button>
                      ) : (
                        <div className="text-sm text-emerald-600 flex items-center gap-2 mt-4 justify-center font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Completed
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
