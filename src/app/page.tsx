"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, CheckCircle2, Building, Users, Megaphone, MapPin, Smartphone } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-gray-900">Forever Florida</span>
        </div>
        <Link href="/login">
          <Button variant="outline" className="font-semibold">Agent Login</Button>
        </Link>
      </header>

      {/* Hero Carousel Section */}
      <section className="w-full bg-slate-50 py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {/* Slide 1 */}
              <CarouselItem>
                <div className="p-1">
                  <Card className="border-none shadow-xl bg-gradient-to-br from-blue-900 to-indigo-800 text-white overflow-hidden rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 md:p-24 text-center min-h-[400px]">
                      <Badge className="mb-4 bg-blue-500/20 text-blue-100 hover:bg-blue-500/30">Leadership</Badge>
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                        A broker who's still in the trenches with you.
                      </h2>
                      <p className="text-lg md:text-xl text-blue-100 max-w-[600px]">
                        Delia Davidson has closed nearly 1,000 transactions in Tampa Bay and still works deals herself — you're not just a name on a roster.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              {/* Slide 2 */}
              <CarouselItem>
                <div className="p-1">
                  <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white overflow-hidden rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 md:p-24 text-center min-h-[400px]">
                      <Badge className="mb-4 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30">Support</Badge>
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                        Real support, not a sink-or-swim roster.
                      </h2>
                      <p className="text-lg md:text-xl text-emerald-100 max-w-[600px]">
                        Structured onboarding, hands-on help from day one, and an office manager who actually answers the phone.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              {/* Slide 3 */}
              <CarouselItem>
                <div className="p-1">
                  <Card className="border-none shadow-xl bg-gradient-to-br from-violet-900 to-purple-900 text-white overflow-hidden rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 md:p-24 text-center min-h-[400px]">
                      <Badge className="mb-4 bg-violet-500/20 text-violet-100 hover:bg-violet-500/30">Technology</Badge>
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
                        Marketing that works while you're at a showing.
                      </h2>
                      <p className="text-lg md:text-xl text-violet-100 max-w-[600px]">
                        Automated lead follow-up, listing promotion, and retargeting — built to bring business to you, not just a CRM login nobody uses.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Agents Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-[800px] mx-auto">
              We provide the tools, support, and culture you need to build a thriving real estate business in Tampa Bay.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { title: "Hands-on Mentorship", desc: "From a nearly 30-year, top 1% Tampa Bay producer.", icon: <Users className="h-6 w-6 text-blue-600" /> },
              { title: "Structured Onboarding", desc: "Real training, not 'figure it out yourself'.", icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" /> },
              { title: "Built-in Marketing", desc: "Social ads, just listed/sold campaigns, and retargeting.", icon: <Megaphone className="h-6 w-6 text-purple-600" /> },
              { title: "Community Rooted", desc: "A tight-knit office in Gulfport/St. Pete.", icon: <MapPin className="h-6 w-6 text-orange-600" /> },
              { title: "Modern Systems", desc: "Cutting-edge tools that are continually improving.", icon: <Smartphone className="h-6 w-6 text-teal-600" /> },
              { title: "Responsive Leadership", desc: "Everett and Delia are always reachable.", icon: <Users className="h-6 w-6 text-indigo-600" /> },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="w-full py-16 md:py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Curious what this could look like?</h2>
            <p className="text-lg text-slate-300">
              Tell us a bit about where you are today, and Delia will personally follow up.
            </p>
          </div>

          {submitted ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-slate-300">Delia will be in touch with you shortly.</p>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-200">Name</label>
                  <Input id="name" required placeholder="Jane Doe" className="bg-slate-900 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-200">Email</label>
                  <Input id="email" type="email" required placeholder="jane@example.com" className="bg-slate-900 border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-200">Phone</label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="bg-slate-900 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="brokerage" className="text-sm font-medium text-slate-200">Current Brokerage</label>
                  <Input id="brokerage" placeholder="XYZ Realty" className="bg-slate-900 border-slate-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-200">Message (Optional)</label>
                <textarea 
                  id="message" 
                  className="flex min-h-[100px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                  placeholder="What are you looking for in a new brokerage?"
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Request a meeting with Delia"}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-6 bg-slate-950 text-slate-400 text-center text-sm border-t border-slate-800">
        <p>© {new Date().getFullYear()} Forever Florida Real Estate. All rights reserved.</p>
      </footer>
    </main>
  );
}
