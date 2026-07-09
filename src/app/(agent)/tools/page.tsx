"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Wrench } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    { name: "BoldTrail", desc: "CRM & Lead Generation", color: "bg-blue-50 border-blue-200", iconCol: "text-blue-600", link: "#" },
    { name: "Transact", desc: "Transaction Management", color: "bg-emerald-50 border-emerald-200", iconCol: "text-emerald-600", link: "#" },
    { name: "Band", desc: "Internal Communication", color: "bg-indigo-50 border-indigo-200", iconCol: "text-indigo-600", link: "#" },
    { name: "QuickBooks", desc: "Accounting Basics", color: "bg-green-50 border-green-200", iconCol: "text-green-600", link: "#" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tool Help Hub</h1>
        <p className="text-gray-500 mt-2">SOPs, FAQs, and cheat sheets for the systems we use every day.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.name} className={`border ${tool.color} shadow-sm`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm ${tool.iconCol}`}>
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription>{tool.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white">
                <Download className="h-4 w-4 mr-2" /> Cheat Sheet
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <ExternalLink className="h-4 w-4 mr-2" /> Login
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-semibold">How do I add a new lead into BoldTrail?</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Log into BoldTrail, click on the "Quick Actions" menu in the top right corner, and select "Add Contact." Fill in their details and make sure to assign them to the correct drip campaign.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-semibold">When should I upload my executed contract to Transact?</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Executed contracts must be uploaded within 24 hours of the effective date to ensure compliance and timely processing by the transaction coordination team.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-semibold">Who do I tag in Band for a marketing request?</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Post in the "Marketing Requests" channel and tag @Sarah for social media graphics or @Everett for physical print materials like just-listed postcards.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
