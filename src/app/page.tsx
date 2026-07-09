"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, CheckCircle2, Building, Users, Megaphone, MapPin, Smartphone, Star } from "lucide-react";
import { useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  
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
    <main className="flex min-h-screen flex-col bg-slate-50 selection:bg-brand-blue/30">
      {/* Navigation */}
      <header className="px-6 py-4 flex justify-between items-center bg-deep-ocean/90 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Forever Florida Real Estate" 
            width={300} 
            height={100} 
            className="h-16 w-auto object-contain drop-shadow-md"
            priority
          />
        </div>
        <Link href="/login">
          <Button variant="outline" className="font-semibold bg-white/5 hover:bg-white/15 text-white border-white/20 transition-all duration-300">
            Agent Login
          </Button>
        </Link>
      </header>

      {/* Hero Section (Asymmetrical) */}
      <section className="relative w-full bg-deep-ocean bg-gradient-to-b from-ocean-dark to-[#030B18] pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden">
        {/* Subtle mesh/glow effect */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container relative mx-auto px-4 md:px-6 z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text (7 cols) */}
            <div className="lg:col-span-7 max-w-2xl animate-fade-in-up">
              <Badge className="mb-8 bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-4 py-1.5 text-sm tracking-widest backdrop-blur-sm animate-fade-in-up delay-100 uppercase">
                Tampa Bay's Premier Brokerage
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.1] drop-shadow-lg">
                Elevate your real estate <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-green to-brand-blue italic pr-2">career.</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-300 font-light leading-relaxed animate-fade-in-up delay-200 border-l-2 border-brand-green pl-6 mt-8">
                Join a boutique brokerage that provides the luxury tools, culture, and high-end aesthetic you need to dominate the market.
              </p>
            </div>

            {/* Right Column: Carousel (5 cols) */}
            <div className="lg:col-span-5 relative mt-12 lg:mt-0 animate-fade-in-up delay-300">
              <div className="absolute -inset-4 bg-gradient-to-br from-white/10 to-transparent blur-2xl rounded-[3rem] -z-10" />
              <Carousel 
                className="w-full"
                plugins={[plugin.current]}
              >
                <CarouselContent>
                  {/* Slide 1 */}
                  <CarouselItem>
                    <div className="p-1">
                      <Card className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-2xl text-white overflow-hidden rounded-[2rem] relative group h-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <CardContent className="flex flex-col items-start justify-end p-10 h-full relative z-10">
                          <Badge className="mb-4 bg-brand-blue/30 text-brand-blue border border-brand-blue/30 px-3 py-1 text-xs uppercase tracking-widest">Leadership</Badge>
                          <h2 className="text-3xl font-bold mb-4 leading-tight">A broker who's still in the trenches.</h2>
                          <p className="text-slate-300 font-light leading-relaxed">
                            Delia Davidson has closed nearly 1,000 transactions in Tampa Bay and still works deals herself.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  {/* Slide 2 */}
                  <CarouselItem>
                    <div className="p-1">
                      <Card className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-2xl text-white overflow-hidden rounded-[2rem] relative group h-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <CardContent className="flex flex-col items-start justify-end p-10 h-full relative z-10">
                          <Badge className="mb-4 bg-brand-green/30 text-brand-green border border-brand-green/30 px-3 py-1 text-xs uppercase tracking-widest">Support</Badge>
                          <h2 className="text-3xl font-bold mb-4 leading-tight">Real support, not a roster.</h2>
                          <p className="text-slate-300 font-light leading-relaxed">
                            Structured onboarding, hands-on help from day one, and a manager who actually answers the phone.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  {/* Slide 3 */}
                  <CarouselItem>
                    <div className="p-1">
                      <Card className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-2xl text-white overflow-hidden rounded-[2rem] relative group h-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <CardContent className="flex flex-col items-start justify-end p-10 h-full relative z-10">
                          <Badge className="mb-4 bg-purple-500/30 text-purple-300 border border-purple-500/30 px-3 py-1 text-xs uppercase tracking-widest">Technology</Badge>
                          <h2 className="text-3xl font-bold mb-4 leading-tight">Marketing that works for you.</h2>
                          <p className="text-slate-300 font-light leading-relaxed">
                            Automated lead follow-up, listing promotion, and retargeting — built to bring business directly to you.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-6 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md" />
                <CarouselNext className="hidden md:flex -right-6 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us (Sticky Asymmetrical Layout) */}
      <section className="w-full py-24 md:py-32 bg-warm-sand/20 relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="lg:flex lg:items-start lg:gap-16">
            
            {/* Left Column: Sticky Title */}
            <div className="lg:w-1/3 lg:sticky lg:top-32 mb-16 lg:mb-0 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-ocean mb-6 leading-tight">Why Agents<br/>Choose Us</h2>
              <div className="w-16 h-1 bg-brand-green mb-8 rounded-full" />
              <p className="text-xl text-slate-600 font-light leading-relaxed pr-8">
                We provide the tools, support, and luxury culture you need to build a thriving real estate business in Tampa Bay. No compromises.
              </p>
            </div>

            {/* Right Column: Staggered Grid */}
            <div className="lg:w-2/3 grid gap-6 sm:gap-8 md:grid-cols-2">
              {[
                { title: "Hands-on Mentorship", desc: "Learn directly from a nearly 30-year, top 1% Tampa Bay producer.", icon: <Star className="h-7 w-7 text-brand-blue" />, delay: 100 },
                { title: "Structured Onboarding", desc: "Real, actionable training instead of 'figure it out yourself'.", icon: <CheckCircle2 className="h-7 w-7 text-brand-green" />, delay: 200 },
                { title: "Built-in Marketing", desc: "Social ads, just listed/sold campaigns, and intelligent retargeting.", icon: <Megaphone className="h-7 w-7 text-purple-600" />, delay: 300 },
                { title: "Community Rooted", desc: "A tight-knit, highly respected office located in Gulfport/St. Pete.", icon: <MapPin className="h-7 w-7 text-orange-500" />, delay: 400 },
                { title: "Modern Systems", desc: "Cutting-edge tools and CRMs that are continually improving.", icon: <Smartphone className="h-7 w-7 text-teal-600" />, delay: 500 },
                { title: "Responsive Leadership", desc: "Everett and Delia are always reachable when you need guidance.", icon: <Users className="h-7 w-7 text-indigo-600" />, delay: 700 },
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-start p-8 md:p-10 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-blue/10 hover:border-brand-blue/20 transition-all duration-500 group animate-fade-in-up ${i % 2 !== 0 ? 'md:mt-16' : ''}`}
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <div className="p-4 bg-slate-50 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-blue/5 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-deep-ocean mb-3">{feature.title}</h3>
                  <p className="text-slate-600 font-light leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Inquiry Form (Asymmetrical Layout) */}
      <section className="w-full py-24 md:py-32 bg-deep-ocean text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-green/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: CTA Text */}
            <div className="animate-fade-in-up max-w-xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Curious what this could look like?</h2>
              <p className="text-xl text-slate-300 font-light leading-relaxed mb-8">
                Tell us a bit about where you are today, and Delia will personally follow up for a confidential, no-pressure meeting.
              </p>
              
              <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm w-max">
                <div className="h-16 w-16 bg-gradient-to-tr from-brand-blue to-brand-green rounded-full flex items-center justify-center shrink-0 border border-white/20">
                  <Star className="h-8 w-8 text-white fill-white/20" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Confidentiality Guaranteed</h4>
                  <p className="text-sm text-slate-400 font-light">Your inquiry stays strictly between us.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="animate-fade-in-up delay-200">
              {submitted ? (
                <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
                  <CardContent className="flex flex-col items-center justify-center p-16 text-center h-[500px]">
                    <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mb-8 border border-brand-green/30">
                      <CheckCircle2 className="h-10 w-10 text-brand-green" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Request Sent!</h3>
                    <p className="text-lg text-slate-300 font-light">Delia has received your inquiry and will be in touch shortly.</p>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-medium text-slate-300 tracking-wider uppercase">Name</label>
                      <Input id="name" required placeholder="Jane Doe" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 focus-visible:ring-brand-blue rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-medium text-slate-300 tracking-wider uppercase">Email</label>
                      <Input id="email" type="email" required placeholder="jane@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 focus-visible:ring-brand-blue rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-medium text-slate-300 tracking-wider uppercase">Phone</label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 focus-visible:ring-brand-blue rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="brokerage" className="text-xs font-medium text-slate-300 tracking-wider uppercase">Current Brokerage</label>
                      <Input id="brokerage" placeholder="XYZ Realty" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 focus-visible:ring-brand-blue rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-medium text-slate-300 tracking-wider uppercase">Message (Optional)</label>
                    <textarea 
                      id="message" 
                      className="flex min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 text-white font-sans transition-all"
                      placeholder="What are you looking for in a new brokerage?"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white h-14 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-1" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Request a meeting"}
                    {!isSubmitting && <ArrowRight className="ml-3 h-5 w-5" />}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-[#030B18] text-slate-500 text-center text-sm border-t border-white/5 font-light">
        <p>© {new Date().getFullYear()} Forever Florida Real Estate. All rights reserved.</p>
      </footer>
    </main>
  );
}
