"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeOnboarding } from "@/app/actions";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { User, Document } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

export function OnboardingForm({ token, user, requiredDocs }: { token: string, user: User, requiredDocs: Document[] }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithUser } = useAuth();
  const router = useRouter();

  // Form State
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [city, setCity] = useState(user.city || "");
  const [state, setState] = useState(user.state || "");
  const [zip, setZip] = useState(user.zip || "");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [mlsNumber, setMlsNumber] = useState(user.mlsNumber || "");
  const [licenseNumber, setLicenseNumber] = useState(user.licenseNumber || "");
  const [driversLicense, setDriversLicense] = useState<string | null>(null);
  const [autoInsurance, setAutoInsurance] = useState<string | null>(null);
  
  const [ackedDocs, setAckedDocs] = useState<Record<string, boolean>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setter(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (step === 2 && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const allDocsAcked = requiredDocs.length === 0 || requiredDocs.every(d => ackedDocs[d.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }

    if (!allDocsAcked) {
      alert("Please acknowledge all required documents.");
      return;
    }

    setIsSubmitting(true);
    
    // Build FormData manually
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("zip", zip);
    formData.append("mlsNumber", mlsNumber);
    formData.append("licenseNumber", licenseNumber);
    formData.append("password", password);
    if (driversLicense) formData.append("driversLicense", driversLicense);
    if (autoInsurance) formData.append("autoInsurance", autoInsurance);
    Object.keys(ackedDocs).forEach(docId => {
      if (ackedDocs[docId]) {
        formData.append("acknowledgedDocs", docId);
      }
    });

    try {
      const updatedUser = await completeOnboarding(token, formData);
      
      // Update the auth context to mock-log in the user using DB data
      if (loginWithUser) {
        loginWithUser({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role as 'agent' | 'admin',
        });
      }
      
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to complete onboarding.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 relative px-4">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step >= i ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-slate-200 text-slate-400'} font-semibold text-sm transition-colors`}>
            {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">1. Personal Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input readOnly value={user.name} className="bg-slate-50 text-slate-500 border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input readOnly value={user.email} className="bg-slate-50 text-slate-500 border-slate-200" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="(555) 123-4567" 
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2 pt-2">
                <label className="text-sm font-medium">Street Address</label>
                <Input 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="123 Ocean Drive" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="Miami" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input 
                    value={state} 
                    onChange={e => setState(e.target.value)} 
                    placeholder="FL" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Zip Code</label>
                  <Input 
                    value={zip} 
                    onChange={e => setZip(e.target.value)} 
                    placeholder="33139" 
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Account Security */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">2. Account Security</h3>
            
            <div className="p-4 bg-blue-50/50 border border-brand-blue/20 rounded-lg mb-6">
              <p className="text-sm text-brand-blue font-medium">
                Your email address (<span className="font-bold">{user.email}</span>) will be your username.
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Please create a secure password to access your Agent Dashboard.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Create Password <span className="text-red-500">*</span></label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password <span className="text-red-500">*</span></label>
                <Input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
                  minLength={8}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Professional Credentials */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">3. Professional Credentials</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">MLS ID <span className="text-red-500">*</span></label>
                <Input 
                  value={mlsNumber} 
                  onChange={e => setMlsNumber(e.target.value)} 
                  required 
                  placeholder="STE123456" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">DBPR License Number <span className="text-red-500">*</span></label>
                <Input 
                  value={licenseNumber} 
                  onChange={e => setLicenseNumber(e.target.value)} 
                  required 
                  placeholder="SL1234567" 
                />
              </div>
              <div className="space-y-2 md:col-span-2 pt-2 border-t mt-2">
                <label className="text-sm font-medium">Upload Driver's License <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={e => handleFileUpload(e, setDriversLicense)}
                    required
                  />
                  {driversLicense && <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" />}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Upload Proof of Auto Insurance <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={e => handleFileUpload(e, setAutoInsurance)}
                    required
                  />
                  {autoInsurance && <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Acknowledgements */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">4. Required Acknowledgements</h3>
            <p className="text-sm text-slate-500">Please review and acknowledge the following documents to complete your onboarding.</p>
            
            <div className="space-y-3 mt-4">
              {requiredDocs.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-500 border border-slate-100">
                  No required documents to acknowledge at this time.
                </div>
              ) : (
                requiredDocs.map(doc => (
                  <div key={doc.id} className={`flex items-start space-x-3 p-4 rounded-lg border ${ackedDocs[doc.id] ? 'border-brand-blue/30 bg-blue-50/50' : 'border-slate-200 bg-white'}`}>
                    <Checkbox 
                      id={`doc-${doc.id}`} 
                      checked={!!ackedDocs[doc.id]}
                      onCheckedChange={(checked) => setAckedDocs({...ackedDocs, [doc.id]: checked as boolean})}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label 
                        htmlFor={`doc-${doc.id}`} 
                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
                      >
                        I acknowledge I have read and agree to the <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline" onClick={(e) => e.stopPropagation()}>{doc.title}</a>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t mt-8 flex justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          ) : <div></div>}
          
          {step < 4 ? (
            <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 flex items-center gap-1">
              Next Step <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={isSubmitting || !allDocsAcked}>
              {isSubmitting ? "Activating Profile..." : "Complete & Login"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
