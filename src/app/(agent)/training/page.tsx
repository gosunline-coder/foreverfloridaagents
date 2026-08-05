"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { VidyardPlayer } from "./VidyardPlayer";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;
import { useAuth } from "@/components/AuthProvider";
import { getTrainingData, markModuleComplete, toggleProfileChecklist } from "@/app/actions/agent";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [selectedVideo, setSelectedVideo] = useState<Module | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  const [zillow, setZillow] = useState(false);
  const [realtor, setRealtor] = useState(false);
  const [redfin, setRedfin] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setZillow(user.zillowProfile || false);
      setRealtor(user.realtorProfile || false);
      setRedfin(user.redfinProfile || false);

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

  const handleChecklistToggle = async (field: "zillowProfile" | "realtorProfile" | "redfinProfile", value: boolean) => {
    if (!user?.id) return;
    if (field === "zillowProfile") setZillow(value);
    if (field === "realtorProfile") setRealtor(value);
    if (field === "redfinProfile") setRedfin(value);
    await toggleProfileChecklist(user.id, field, value);
  };

  const handleComplete = async (id: string) => {
    if (!completedDocs.includes(id) && user?.id) {
      setCompletedDocs([...completedDocs, id]); // Optimistic update
      await markModuleComplete(user.id, id);
    }
    setVideoEnded(true);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading training modules...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Training Modules</h1>
        <p className="text-muted-foreground mt-2">Complete these sequences to get up and running smoothly.</p>
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
                  <Card key={mod.id} className={`overflow-hidden transition-all ${isCompleted ? 'border-brand-green/30 bg-brand-green/10/30' : 'border-border dark:border-white/10 hover:border-brand-blue/50'}`}>
                    <div 
                      className="aspect-video bg-muted dark:bg-slate-900 relative group cursor-pointer flex items-center justify-center"
                      onClick={() => { setSelectedVideo(mod); setVideoEnded(false); }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-slate-900/80 to-transparent pointer-events-none" />
                      <PlayCircle className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all z-10" />
                      {isCompleted && (
                        <div className="absolute top-2 right-2 bg-brand-green rounded-full p-1 z-10">
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
                          onClick={() => { setSelectedVideo(mod); setVideoEnded(false); }}
                        >
                          Watch Video
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="text-sm text-brand-green flex items-center justify-center font-medium border border-brand-green/30 rounded-md bg-brand-green/10">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Completed
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-slate-400"
                            onClick={() => { setSelectedVideo(mod); setVideoEnded(false); }}
                          >
                            Watch Again
                          </Button>
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

      <div className="mt-12 bg-card rounded-2xl border shadow-sm p-6 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Did you...</h2>
        <p className="text-muted-foreground mb-6">Change your profile to show you are now an Agent at Forever Florida?</p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="zillow" 
              checked={zillow} 
              onCheckedChange={(checked) => handleChecklistToggle("zillowProfile", checked as boolean)} 
            />
            <label htmlFor="zillow" className="text-sm font-medium leading-none cursor-pointer">
              <a href="https://www.zillow.com/agent-profile/" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-semibold">Zillow.com</a>
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="realtor" 
              checked={realtor} 
              onCheckedChange={(checked) => handleChecklistToggle("realtorProfile", checked as boolean)} 
            />
            <label htmlFor="realtor" className="text-sm font-medium leading-none cursor-pointer">
              <a href="https://dashboard.realtor.com/" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-semibold">Realtor.com</a>
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="redfin" 
              checked={redfin} 
              onCheckedChange={(checked) => handleChecklistToggle("redfinProfile", checked as boolean)} 
            />
            <label htmlFor="redfin" className="text-sm font-medium leading-none cursor-pointer">
              <a href="https://www.redfin.com/" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-semibold">Redfin</a>
            </label>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl bg-card border-border shadow-2xl relative overflow-hidden">
            <CardHeader className="bg-muted border-b border-border p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">{selectedVideo.title}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedVideo(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                <span className="sr-only">Close</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </Button>
            </CardHeader>
            <div className="aspect-video bg-black relative">
              {selectedVideo.videoUrl.includes('vidyard.com') ? (
                <VidyardPlayer 
                  url={selectedVideo.videoUrl} 
                  onEnded={() => handleComplete(selectedVideo.id)} 
                />
              ) : (
                <ReactPlayer 
                  url={selectedVideo.videoUrl} 
                  width="100%" 
                  height="100%" 
                  controls
                  playing
                  onEnded={() => handleComplete(selectedVideo.id)}
                />
              )}
            </div>
            <CardContent className="p-6 bg-card border-t border-border flex justify-between items-center">
              <div>
                {completedDocs.includes(selectedVideo.id) ? (
                  <div className="text-brand-green flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-5 w-5" /> Completed
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Make sure you watch the entire video before marking it complete.</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setSelectedVideo(null); setVideoEnded(false); }}>
                  Close
                </Button>
                {!completedDocs.includes(selectedVideo.id) && (
                  <Button 
                    className="bg-brand-blue hover:bg-brand-blue/90"
                    onClick={() => handleComplete(selectedVideo.id)}
                    disabled={!videoEnded}
                  >
                    {videoEnded ? "Mark as Completed" : "Watch video to complete..."}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
