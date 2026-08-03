"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Wrench, X } from "lucide-react";
import { useState } from "react";

export default function ToolsPage() {
  const [activeCheatSheet, setActiveCheatSheet] = useState<string | null>(null);

  const tools = [
    { id: "boldtrail", name: "BoldTrail", desc: "CRM & Lead Generation", color: "bg-brand-blue/10 border-brand-blue/30", iconCol: "text-brand-blue", link: "#", hasCheatSheet: true },
    { id: "transact", name: "Transact", desc: "Transaction Management", color: "bg-brand-green/10 border-brand-green/30", iconCol: "text-brand-green", link: "#", hasCheatSheet: false },
    { id: "band", name: "Band", desc: "Internal Communication", color: "bg-[#00DA5D]/10 border-[#00DA5D]/30", iconCol: "text-[#00DA5D]", link: "#", hasCheatSheet: false },
    { id: "stellar", name: "Stellar MLS", desc: "Multiple Listing Service", color: "bg-emerald-500/10 border-emerald-500/30", iconCol: "text-emerald-400", link: "#", hasCheatSheet: false },
    { id: "thanks", name: "Thanks.io", desc: "Automated Direct Mail", color: "bg-[#6208CC]/20 border-[#6208CC]/40", iconCol: "text-[#a365ff]", link: "#", hasCheatSheet: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Tool Help Hub</h1>
        <p className="text-gray-500 mt-2">SOPs, FAQs, and cheat sheets for the systems we use every day.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.id} className={`border ${tool.color} shadow-sm`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 shadow-sm ${tool.iconCol}`}>
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription>{tool.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/5"
                disabled={!tool.hasCheatSheet}
                onClick={() => tool.hasCheatSheet && setActiveCheatSheet(tool.id)}
              >
                <Download className="h-4 w-4 mr-2" /> Cheat Sheet
              </Button>
              <Button variant="outline" size="sm" className="bg-white/5">
                <ExternalLink className="h-4 w-4 mr-2" /> Login
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-white/5 rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-semibold">How do I add a new lead into BoldTrail?</AccordionTrigger>
            <AccordionContent className="text-slate-300 leading-relaxed">
              Log into BoldTrail, click on the "Quick Actions" menu in the top right corner, and select "Add Contact." Fill in their details and make sure to assign them to the correct drip campaign.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-semibold">When should I upload my executed contract to Transact?</AccordionTrigger>
            <AccordionContent className="text-slate-300 leading-relaxed">
              Executed contracts must be uploaded within 24 hours of the effective date to ensure compliance and timely processing by the transaction coordination team.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-semibold">Who do I tag in Band for a marketing request?</AccordionTrigger>
            <AccordionContent className="text-slate-300 leading-relaxed">
              Post in the "Marketing Requests" channel and tag @Sarah for social media graphics or @Everett for physical print materials like just-listed postcards.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Slide-out Drawer for Cheat Sheets */}
      {activeCheatSheet === "boldtrail" && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity p-0 md:p-4">
          <Card className="w-full h-full md:h-auto md:max-h-[95vh] md:max-w-2xl bg-[#08101E] border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">BoldTrail Cheat Sheet</h2>
                <p className="text-slate-400 text-sm mt-1">The Essential Guide for New Real Estate Agents</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveCheatSheet(null)} className="text-slate-400 hover:text-white rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-8 overflow-y-auto space-y-10 prose prose-invert max-w-none text-slate-300">
              <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">What is BoldTrail?</h3>
                <p>BoldTrail (by Inside Real Estate) is a complete tech ecosystem designed to be your Real Estate Growth Engine. It bridges front and back-office operations to scale your business.</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong className="text-white">Smart CRM:</strong> Centralizes leads, sphere of influence, and customer data.</li>
                  <li><strong className="text-white">AI-Empowered Nurturing:</strong> Behavioral automation proven to drive 10x higher engagement and create clients-for-life.</li>
                  <li><strong className="text-white">All-in-One Tech:</strong> Includes customizable IDX websites, marketing automation, business analytics, and back-office automation.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Daily Rhythms & Best Practices</h3>
                <p className="mb-4">Top producers structure their days to protect revenue-generating activities.</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">1. Protect Your Mornings</h4>
                    <p className="text-sm">Dedicate a 60–90 minute block every morning to proactive prospecting <strong>before</strong> checking email or the MLS.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">2. Segment Your Leads</h4>
                    <p className="text-sm mb-2">Do not spend equal time on every lead:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li><strong>Hot Leads:</strong> Get direct, personal calls.</li>
                      <li><strong>Warm Leads:</strong> Automated nurture with occasional check-ins.</li>
                      <li><strong>Cold Leads:</strong> Put them on a 90-day or 12-month automated follow-up sequence.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">3. Batch Administrative Work</h4>
                    <p className="text-sm">Instead of answering emails constantly, batch admin tasks into a dedicated afternoon window. This prevents costly context-switching.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">4. The End-of-Day Reset</h4>
                    <p className="text-sm">Review tomorrow's calendar, set your top 3 priorities for the next morning, and log off intentionally.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Quick Lead Gen Tactics</h3>
                <ul className="list-disc pl-5 space-y-3">
                  <li><strong>Import & Organize:</strong> Import your Sphere of Influence (SOI) and aggressively use hashtags to sort and target specific contact niches via Contact Filters.</li>
                  <li><strong>Squeeze Pages:</strong> Create Single Property IDX Squeeze Pages and share them on social media. Build a hashtag into the squeeze page for tracking.</li>
                  <li><strong>Custom Text Codes:</strong> Set up custom text calls-to-action for sign riders or print media.</li>
                  <li><strong>Open House App:</strong> Automatically capture buyer/seller info at open houses. Attendees are instantly synced to BoldTrail with designated hashtags.</li>
                </ul>
                <div className="mt-6 p-4 rounded-xl bg-brand-blue/10 border border-brand-blue/30 text-brand-blue">
                  <strong className="block mb-1">Pro Tip:</strong>
                  <span className="text-sm">Utilize BoldTrail's Lead Configuration Specialists for free concierge contact imports instead of doing DIY CSV uploads!</span>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">The "Streams" Mobile App</h3>
                <p className="mb-4">Streams is BoldTrail's new mobile companion app built for agents who need to stay responsive on the go.</p>
                <div className="space-y-4 text-sm">
                  <p><strong>My Day Dashboard:</strong> Surfaces urgent, time-sensitive tasks that directly impact your Vitals score.</p>
                  <p><strong>High-Intent Behavioral Signals:</strong> Alerts you instantly when leads return to your site, favorite properties, or view 5+ properties in a day.</p>
                  <p><strong>One-Tap Engagement:</strong> Call, text, or email directly from the app via your Smart Number. You can now attach files to texts.</p>
                  <p><strong>Hands-Free AI Assistant:</strong> Log notes, set reminders, and update your CRM via voice without manual entry.</p>
                  <p><strong>Zero-Out Workflow:</strong> Focuses on clearing time-sensitive tasks first, ensuring nothing slips through the cracks.</p>
                </div>
              </section>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
