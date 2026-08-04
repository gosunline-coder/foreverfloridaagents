"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, CheckCircle2, Building, Users, Megaphone, MapPin, Smartphone, Star } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { submitInquiry } from "@/app/actions/public";

export default function Home() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    await submitInquiry(formData);
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground selection:bg-brand-blue/30 w-full">
      {/* Navigation */}
      <header className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-gradient-to-r from-[#bde871]/95 via-brand-lime/95 to-[#84cc16]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.05)] dark:bg-none dark:shadow-none dark:bg-deep-ocean/90 backdrop-blur-lg sticky top-0 z-50 border-b border-border w-full transition-colors duration-300">
        <div className="flex items-center gap-2 min-w-0 shrink">
          <Image 
            src={mounted && resolvedTheme === 'dark' ? "/logo.png" : "/logo-dark.png"} 
            alt="Forever Florida Real Estate" 
            width={300} 
            height={100} 
            className="h-10 sm:h-12 md:h-16 w-auto max-w-[180px] sm:max-w-[250px] md:max-w-none object-contain drop-shadow-md shrink"
            priority
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <ThemeToggle />
          <Link href="/sign-in">
            <Button size="lg" className="bg-brand-blue hover:bg-blue-700 text-white shadow-lg text-lg px-8">
              Agent Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section (Asymmetrical) */}
      <section className="relative w-full bg-deep-ocean bg-gradient-to-b from-ocean-dark to-[#030B18] pt-8 pb-28 md:pt-16 md:pb-40 overflow-hidden">
        {/* Subtle mesh/glow effect */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl relative mx-auto px-4 md:px-6 z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full min-w-0">
            
            {/* Left Column: Text (7 cols) */}
            <div className="lg:col-span-7 max-w-2xl min-w-0 w-full">
              <Badge className="mb-6 md:mb-8 bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-3 md:px-4 py-1.5 text-xs md:text-sm tracking-widest backdrop-blur-sm uppercase max-w-full text-center whitespace-normal h-auto leading-relaxed">
                Tampa Bay's Premier Brokerage
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6 leading-[1.1] drop-shadow-lg break-words">
                Elevate your real estate <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-green to-brand-blue italic pr-2">career.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-2xl text-slate-300 font-light leading-relaxed border-l-2 border-brand-green pl-4 md:pl-6 mt-6 md:mt-8 break-words">
                Join a boutique brokerage that provides the luxury tools, culture, and high-end aesthetic you need to dominate the market.
              </p>
            </div>

            {/* Right Column: Carousel (5 cols) */}
            <div className="lg:col-span-5 relative mt-10 lg:mt-0 min-w-0 w-full">
              <div className="absolute -inset-4 bg-gradient-to-br from-white/10 to-transparent blur-2xl rounded-[3rem] -z-10" />
              <div className="w-full min-w-0 overflow-hidden rounded-[2rem]">
                <Carousel 
                  className="w-full min-w-0"
                  plugins={[plugin.current]}
                >
                  <CarouselContent className="min-w-0">
                    {/* Slide 1 */}
                    <CarouselItem className="min-w-0">
                      <div className="p-1 min-w-0">
                        <Card className="border-border shadow-2xl bg-card backdrop-blur-2xl text-card-foreground overflow-hidden rounded-[2rem] relative group h-[400px] sm:h-[500px]">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <CardContent className="flex flex-col items-start justify-end p-8 sm:p-10 h-full relative z-10 min-w-0 w-full">
                            <Badge className="mb-4 bg-brand-blue/30 text-brand-blue border border-brand-blue/30 px-3 py-1 text-xs uppercase tracking-widest max-w-full truncate">Leadership</Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight break-words">A broker who's still in the trenches.</h2>
                            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed break-words line-clamp-4">
                              Delia Davidson has closed nearly 1,000 transactions in Tampa Bay and still works deals herself.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                    {/* Slide 2 */}
                    <CarouselItem className="min-w-0">
                      <div className="p-1 min-w-0">
                        <Card className="border-border shadow-2xl bg-card backdrop-blur-2xl text-card-foreground overflow-hidden rounded-[2rem] relative group h-[400px] sm:h-[500px]">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <CardContent className="flex flex-col items-start justify-end p-8 sm:p-10 h-full relative z-10 min-w-0 w-full">
                            <Badge className="mb-4 bg-brand-green/30 text-brand-green border border-brand-green/30 px-3 py-1 text-xs uppercase tracking-widest max-w-full truncate">Support</Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight break-words">Real support, not a roster.</h2>
                            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed break-words line-clamp-4">
                              Structured onboarding, hands-on help from day one, and a manager who actually answers the phone.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                    {/* Slide 3 */}
                    <CarouselItem className="min-w-0">
                      <div className="p-1 min-w-0">
                        <Card className="border-border shadow-2xl bg-card backdrop-blur-2xl text-card-foreground overflow-hidden rounded-[2rem] relative group h-[400px] sm:h-[500px]">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <CardContent className="flex flex-col items-start justify-end p-8 sm:p-10 h-full relative z-10 min-w-0 w-full">
                            <Badge className="mb-4 bg-purple-500/30 text-purple-600 border border-purple-500/30 px-3 py-1 text-xs uppercase tracking-widest max-w-full truncate">Technology</Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight break-words">Marketing that works for you.</h2>
                            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed break-words line-clamp-4">
                              Automated lead follow-up, listing promotion, and retargeting — built to bring business directly to you.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex -left-6 bg-card text-foreground border-border hover:bg-muted transition-all backdrop-blur-md" />
                  <CarouselNext className="hidden md:flex -right-6 bg-card text-foreground border-border hover:bg-muted transition-all backdrop-blur-md" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us (Sticky Asymmetrical Layout) */}
      <section className="w-full py-16 md:py-32 bg-secondary relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-16 w-full min-w-0">
            
            {/* Left Column: Sticky Title */}
            <div className="lg:w-1/3 lg:sticky lg:top-32 w-full min-w-0">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight break-words">Why Agents<br/>Choose Us</h2>
              <div className="w-16 h-1 bg-brand-green mb-8 rounded-full" />
              <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed lg:pr-8 break-words">
                We provide the tools, support, and luxury culture you need to build a thriving real estate business in Tampa Bay. No compromises.
              </p>
            </div>

            {/* Right Column: Staggered Grid */}
            <div className="lg:w-2/3 grid gap-6 sm:gap-8 md:grid-cols-2 w-full min-w-0">
              {[
                { title: "Hands-on Mentorship", desc: "Learn directly from a nearly 30-year, top 1% Tampa Bay producer.", icon: <Star className="h-7 w-7 text-brand-blue" /> },
                { title: "Structured Onboarding", desc: "Real, actionable training instead of 'figure it out yourself'.", icon: <CheckCircle2 className="h-7 w-7 text-brand-green" /> },
                { title: "Built-in Marketing", desc: "Social ads, just listed/sold campaigns, and intelligent retargeting.", icon: <Megaphone className="h-7 w-7 text-purple-600" /> },
                { title: "Community Rooted", desc: "A tight-knit, highly respected office located in Gulfport/St. Pete.", icon: <MapPin className="h-7 w-7 text-orange-500" /> },
                { title: "Modern Systems", desc: "Cutting-edge tools and CRMs that are continually improving.", icon: <Smartphone className="h-7 w-7 text-teal-600" /> },
                { title: "Responsive Leadership", desc: "Everett and Delia are always reachable when you need guidance.", icon: <Users className="h-7 w-7 text-indigo-600" /> },
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-start p-6 sm:p-8 md:p-10 bg-card rounded-[2rem] border border-border shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-blue/10 hover:border-brand-blue/20 transition-all duration-500 group min-w-0 w-full ${i % 2 !== 0 ? 'md:mt-16' : ''}`}
                >
                  <div className="p-4 bg-muted rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-blue/5 transition-transform duration-500 shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 break-words w-full">{feature.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed break-words w-full">{feature.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Inquiry Form (Asymmetrical Layout) */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-16 transition-colors duration-300">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-brand-green/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full min-w-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full min-w-0">
            
            {/* Left Column: CTA Text */}
            <div className="max-w-xl min-w-0 w-full">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight break-words">Curious what this could look like?</h2>
              <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed mb-8 break-words">
                Tell us a bit about where you are today, and Delia will personally follow up for a confidential, no-pressure meeting.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card p-5 sm:p-6 rounded-2xl border border-border backdrop-blur-sm w-full md:w-max min-w-0">
                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-tr from-brand-blue to-brand-green rounded-full flex items-center justify-center shrink-0 border border-white/20">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-white/20" />
                </div>
                <div className="min-w-0 w-full">
                  <h4 className="font-bold text-base sm:text-lg break-words">Confidentiality Guaranteed</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light break-words">Your inquiry stays strictly between us.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="min-w-0 w-full">
              {submitted ? (
                <Card className="bg-card border-border backdrop-blur-2xl w-full">
                  <CardContent className="flex flex-col items-center justify-center p-8 sm:p-16 text-center h-[400px] sm:h-[500px] min-w-0 w-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-green/20 rounded-full flex items-center justify-center mb-6 sm:mb-8 border border-brand-green/30 shrink-0">
                      <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-brand-green" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 break-words">Request Sent!</h3>
                    <p className="text-base sm:text-lg text-muted-foreground font-light break-words">Delia has received your inquiry and will be in touch shortly.</p>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 md:p-10 rounded-[2rem] border border-border shadow-2xl backdrop-blur-2xl w-full min-w-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0 w-full">
                    <div className="space-y-2 min-w-0">
                      <label htmlFor="name" className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Name</label>
                      <Input id="name" name="name" required placeholder="Jane Doe" className="bg-background border-border text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-brand-blue rounded-xl w-full" />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <label htmlFor="email" className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Email</label>
                      <Input id="email" name="email" type="email" required placeholder="jane@example.com" className="bg-background border-border text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-brand-blue rounded-xl w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-w-0 w-full">
                    <div className="space-y-2 min-w-0">
                      <label htmlFor="phone" className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Phone</label>
                      <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className="bg-background border-border text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-brand-blue rounded-xl w-full" />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <label htmlFor="brokerage" className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Current Brokerage</label>
                      <Input id="brokerage" name="currentBrokerage" placeholder="XYZ Realty" className="bg-background border-border text-foreground placeholder:text-muted-foreground h-12 focus-visible:ring-brand-blue rounded-xl w-full" />
                    </div>
                  </div>
                  <div className="space-y-2 min-w-0 w-full">
                    <label htmlFor="message" className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Message (Optional)</label>
                    <textarea 
                      id="message" 
                      name="message"
                      className="flex min-h-[100px] sm:min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 text-foreground font-sans transition-all"
                      placeholder="What are you looking for in a new brokerage?"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-1" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Request a meeting"}
                    {!isSubmitting && <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-[#030B18] text-slate-500 text-center text-xs sm:text-sm border-t border-white/5 font-light min-w-0">
        <p>© {new Date().getFullYear()} Forever Florida Real Estate. All rights reserved.</p>
      </footer>
    </main>
  );
}
