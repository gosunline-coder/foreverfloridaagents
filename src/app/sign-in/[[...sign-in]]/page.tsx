import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ocean-dark relative overflow-hidden p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-green/10 blur-[120px]" />
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-3 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <Image 
          src="/logo.png" 
          alt="Forever Florida Real Estate" 
          width={200} 
          height={60} 
          className="w-auto h-12 object-contain drop-shadow-md brightness-0 invert"
          priority
        />
      </div>
      
      <div className="z-10 animate-in fade-in zoom-in-95 duration-500">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full shadow-2xl rounded-xl",
              card: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
              headerTitle: "text-white font-heading font-bold text-3xl",
              headerSubtitle: "text-slate-400 font-sans",
              socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white",
              socialButtonsBlockButtonText: "text-slate-200 font-sans",
              formFieldLabel: "text-slate-300 font-sans font-medium",
              formFieldInput: "bg-white/10 border-white/10 text-white placeholder:text-slate-500",
              formButtonPrimary: "bg-brand-blue hover:bg-blue-600 text-white font-sans text-base h-10",
              footerActionText: "text-slate-400 font-sans",
              footerActionLink: "text-brand-blue hover:text-blue-400 font-sans",
              identityPreviewText: "text-white font-sans",
              identityPreviewEditButton: "text-brand-blue hover:text-blue-400",
              dividerLine: "bg-white/10",
              dividerText: "text-slate-500 bg-transparent font-sans",
            }
          }}
          routing="path" 
          path="/sign-in" 
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
