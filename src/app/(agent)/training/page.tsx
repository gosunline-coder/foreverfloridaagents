"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getTrainingData, markModuleComplete } from "@/app/actions/agent";

type Module = {
  id: string;
  title: string;
  videoUrl: string;
  sequenceStage: string;
  requiresAck: boolean;
};

export default function TrainingPage() {
  const { user } = useAuth();
  const [completedDocs, setCompletedDocs] = useState<string[]>([]);
  const [modules, setModules] = useState<Record<string, Module[]>>({ day1: [], week1: [], month1: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getTrainingData(user.id).then((data) => {
        const grouped: Record<string, Module[]> = { day1: [], week1: [], month1: [] };
        data.modules.forEach((mod: any) => {
          if (!grouped[mod.sequenceStage]) grouped[mod.sequenceStage] = [];
          grouped[mod.sequenceStage].push(mod);
        });
        setModules(grouped);
        setCompletedDocs(data.completions.map((c: any) => c.moduleId));
        setLoading(false);
      });
    }
  }, [user]);

  const handleComplete = async (id: string) => {
    if (!completedDocs.includes(id) && user?.id) {
      setCompletedDocs([...completedDocs, id]); // Optimistic update
      await markModuleComplete(user.id, id);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading training modules...</div>;
  }

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
                        <div className="absolute top-2 right-2 bg-brand-green rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg leading-tight">{mod.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2 mt-2">
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
                        <div className="text-sm text-brand-green flex items-center gap-2 mt-4 justify-center font-medium">
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
