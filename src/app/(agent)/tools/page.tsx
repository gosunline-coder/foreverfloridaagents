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
    { id: "transact", name: "TransactionDesk", desc: "Transaction Management", color: "bg-brand-green/10 border-brand-green/30", iconCol: "text-brand-green", link: "#", hasCheatSheet: true },
    { id: "band", name: "BAND", desc: "Internal Communication", color: "bg-[#00DA5D]/10 border-[#00DA5D]/30", iconCol: "text-[#00DA5D]", link: "#", hasCheatSheet: true },
    { id: "stellar", name: "Stellar MLS", desc: "Multiple Listing Service", color: "bg-emerald-500/10 border-emerald-500/30", iconCol: "text-emerald-400", link: "#", hasCheatSheet: true },
    { id: "thanks", name: "Thanks.io", desc: "Automated Direct Mail", color: "bg-[#6208CC]/20 border-[#6208CC]/40", iconCol: "text-[#a365ff]", link: "#", hasCheatSheet: true },
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

      {/* TransactionDesk Modal */}
      {activeCheatSheet === "transact" && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity p-0 md:p-4">
          <Card className="w-full h-full md:h-auto md:max-h-[95vh] md:max-w-2xl bg-[#08101E] border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">TransactionDesk Cheat Sheet</h2>
                <p className="text-slate-400 text-sm mt-1">The Essential Guide for Compliance and Forms</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveCheatSheet(null)} className="text-slate-400 hover:text-white rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-8 overflow-y-auto space-y-10 prose prose-invert max-w-none text-slate-300">
              <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">What is TransactionDesk?</h3>
                <p>TransactionDesk (Transactions - TransactionDesk Edition) by Lone Wolf is our core transaction management platform. It integrates state/local association forms, document storage, and e-signatures (Authentisign) into one seamless workflow.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Core Workflow</h3>
                <ul className="list-disc pl-5 mt-4 space-y-3">
                  <li><strong className="text-white">Templates:</strong> Always start a new file by selecting a Template (e.g., "New Listing" or "Purchase Offer"). This auto-populates all the mandatory compliance forms and saves you from manually adding them every time.</li>
                  <li><strong className="text-white">Forms vs. Documents:</strong> "Forms" are interactive (fillable) state/association documents pulled directly from the library. "Documents" are static PDFs (like an MLS printout or a pre-approval letter) that you upload from your computer.</li>
                  <li><strong className="text-white">Authentisign:</strong> Select the forms/documents you need signed and create a "Signing Packet". Drag and drop signature and initial blocks for your clients.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Top Efficiency Tips</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">1. Customize Your Dashboard</h4>
                    <p className="text-sm">Remove widgets you don't use and add the "My Transactions" and "Authentisign" widgets to your home screen to save clicks.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">2. Use Checklists</h4>
                    <p className="text-sm">Utilize the "Checklist" feature to track your deadlines and compliance requirements. This keeps all your to-dos in one place.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">3. Mobile App</h4>
                    <p className="text-sm">Download the TransactionDesk mobile app so you can view, share, or resend documents while away from your computer.</p>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </div>
      )}

      {/* Thanks.io Modal */}
      {activeCheatSheet === "thanks" && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity p-0 md:p-4">
          <Card className="w-full h-full md:h-auto md:max-h-[95vh] md:max-w-2xl bg-[#08101E] border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Thanks.io Cheat Sheet</h2>
                <p className="text-slate-400 text-sm mt-1">Automated Direct Mail & Physical Lead Nurturing</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveCheatSheet(null)} className="text-slate-400 hover:text-white rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-8 overflow-y-auto space-y-10 prose prose-invert max-w-none text-slate-300">
              <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">What is Thanks.io?</h3>
                <p>Thanks.io is an automated direct mail platform that integrates directly with your CRM. It sends highly personalized postcards, letters, and gift cards with AI-driven "handwriting" (including cross-outs for authenticity) without you having to lick a single stamp.</p>
                <div className="mt-6 p-4 rounded-xl bg-[#6208CC]/20 border border-[#6208CC]/40 text-[#d8b4fe]">
                  <strong className="block mb-1 text-xl">The Primary Goal: Turn One Listing Into Two</strong>
                  <span className="text-sm">Every listing you take is an opportunity to generate another. By aggressively marketing your listings (and sales) to the immediate neighborhood, you establish yourself as the hyper-local expert.</span>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Top Real Estate Campaigns</h3>
                <ul className="list-disc pl-5 mt-4 space-y-3">
                  <li><strong className="text-white">Neighbor Blast (Radius Search):</strong> Automatically send "Just Listed" or "Just Sold" postcards to the 100-200 homes immediately surrounding your property.</li>
                  <li><strong className="text-white">Golden Letters:</strong> High-touch, handwritten-style letters sent to top-tier seller prospects (e.g., "I have a buyer specifically looking in your neighborhood").</li>
                  <li><strong className="text-white">Anniversary Automation:</strong> Trigger a "Happy Homeiversary" card every year automatically based on CRM data to stay top-of-mind for referrals.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Best Practices for ROI</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">1. The "One Clear Ask" Rule</h4>
                    <p className="text-sm">Every piece of mail must have a single, unambiguous Call to Action. Use the built-in QR codes or a custom URL so you can digitally track physical mail responses.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">2. Consistency Over Volume</h4>
                    <p className="text-sm">A single mailer rarely converts. Plan for a sequence of 3–6 touchpoints over several months to a smaller, targeted list (like past clients) rather than blasting a huge cold list once.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">3. Data Hygiene</h4>
                    <p className="text-sm">Ensure your CRM data is scrubbed. Check for undeliverables and verify owner-occupied vs. renter status to avoid wasted spend.</p>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </div>
      )}

      {/* BAND Modal */}
      {activeCheatSheet === "band" && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity p-0 md:p-4">
          <Card className="w-full h-full md:h-auto md:max-h-[95vh] md:max-w-2xl bg-[#08101E] border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">BAND App Cheat Sheet</h2>
                <p className="text-slate-400 text-sm mt-1">Team Communication & Accountability</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveCheatSheet(null)} className="text-slate-400 hover:text-white rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-8 overflow-y-auto space-y-10 prose prose-invert max-w-none text-slate-300">
              <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">What is BAND?</h3>
                <p>BAND is our central hub for all internal brokerage communication. It eliminates scattered email threads and messy group texts, serving as our private, secure space for announcements, event scheduling, and file sharing.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Core Features & Usage</h3>
                <ul className="list-disc pl-5 mt-4 space-y-3">
                  <li><strong className="text-white">The Feed (Posts):</strong> Used for official brokerage announcements, market updates, and celebrating wins. <em>Read these daily.</em></li>
                  <li><strong className="text-white">Team Calendar:</strong> Check here for upcoming training sessions, mandatory meetings, and office events. You can RSVP directly in the app.</li>
                  <li><strong className="text-white">Chat Rooms:</strong> Used for quick questions and informal chatter. We have specific subgroups (e.g., Marketing, Admin Support) so you only see what's relevant to you.</li>
                  <li><strong className="text-white">File Sharing:</strong> A centralized repository for important documents, listing photos, and training materials that you can access from your phone.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Best Practices</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">1. Notifications ON</h4>
                    <p className="text-sm">Since BAND is our official channel, ensure your push notifications are enabled so you never miss critical updates or compliance changes.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">2. Use Hashtags</h4>
                    <p className="text-sm">When creating a post, use hashtags (e.g., #openhouse, #referral) so other agents can easily search and filter the feed.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">3. Professional Profiles</h4>
                    <p className="text-sm">Ensure your BAND profile uses your real name and a professional headshot so everyone knows who they are interacting with.</p>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </div>
      )}

      {/* Stellar MLS Modal */}
      {activeCheatSheet === "stellar" && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity p-0 md:p-4">
          <Card className="w-full h-full md:h-auto md:max-h-[95vh] md:max-w-2xl bg-[#08101E] border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 md:rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Stellar MLS Cheat Sheet</h2>
                <p className="text-slate-400 text-sm mt-1">Data Accuracy & Client Collaboration Hub</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveCheatSheet(null)} className="text-slate-400 hover:text-white rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-8 overflow-y-auto space-y-10 prose prose-invert max-w-none text-slate-300">
              <section>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">What is Stellar MLS?</h3>
                <p>Stellar MLS is our primary Multiple Listing Service database. It's not just for searching properties; it is the official hub for real estate data accuracy, compliance, and professional client collaboration.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Core Features to Master</h3>
                <ul className="list-disc pl-5 mt-4 space-y-3">
                  <li><strong className="text-white">Matrix:</strong> The core search engine. Master saved searches and setting up auto-email alerts for your active buyers.</li>
                  <li><strong className="text-white">OneHome Portal:</strong> The client-facing portal that integrates with Matrix. It allows your buyers to rate properties, calculate commute times, and collaborate with you in real-time.</li>
                  <li><strong className="text-white">Realist / iMapp:</strong> Integrated public records systems. Use these to verify ownership, pull tax data, and research property history before going on a listing appointment.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Compliance & Best Practices</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white">1. Mandatory Listing Input</h4>
                    <p className="text-sm">Before submitting any new listing, you must have an executed Listing Agreement, a signed Listing Data Entry Form, and at least one exterior property photo.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">2. The "1-Day" Rule</h4>
                    <p className="text-sm">Stellar MLS enforces strict timelines. Publicly marketing a property requires entering it into the MLS within 1 business day to avoid hefty fines.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">3. Stellar MLS University</h4>
                    <p className="text-sm">Do not rely on third-party guides for rules. Access <em>Stellar MLS University</em> via your dashboard for the official compliance rulebook and step-by-step video tutorials.</p>
                  </div>
                </div>
              </section>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
