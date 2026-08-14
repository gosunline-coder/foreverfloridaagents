"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser as useClerkUser, useClerk } from '@clerk/nextjs';
import { syncUserByEmail } from '@/app/actions/agent';
import { useRouter } from 'next/navigation';

export type UserRole = 'agent' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  licenseNumber?: string | null;
  licenseStatus?: string | null;
  licenseExpiration?: string | Date | null;
  lastVerifiedAt?: string | Date | null;
  mlsNumber?: string | null;
  driversLicense?: string | null;
  autoInsurance?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  zillowProfile?: boolean;
  realtorProfile?: boolean;
  redfinProfile?: boolean;
}

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  isUnauthorized: boolean;
  user: User | null;
  login: (role: UserRole) => void;
  loginWithUser: (user: User) => void;
  logout: () => void;
  clerkLoaded?: boolean;
  clerkSignedIn?: boolean;
  hasClerkUser?: boolean;
  isSyncing?: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  isUnauthorized: false,
  user: null,
  login: () => {},
  loginWithUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn, user: clerkUser } = useClerkUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  const [internalUser, setInternalUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const email = clerkUser?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (clerkLoaded && clerkSignedIn && email) {
      setIsSyncing(true);
      const failsafe = setTimeout(() => {
        console.error("Failsafe timeout: User sync hung");
        setIsSyncing(false);
      }, 30000);

      syncUserByEmail().then((res) => {
        clearTimeout(failsafe);
        
        if (res.status === 'not_found') {
          setAuthError('Your account was not found in our system. Please contact administration.');
          setIsSyncing(false);
          return;
        }
        if (res.status === 'email_claimed') {
          setAuthError('This account is already linked to a different sign-in. Please contact the broker.');
          setIsSyncing(false);
          return;
        }
        if (res.status === 'inactive') {
          setAuthError('Your account is currently inactive. Please contact administration.');
          setIsSyncing(false);
          return;
        }
        if (res.status === 'no_session' || res.status === 'no_email') {
          setAuthError('Unable to verify your session or email address. Please log in again.');
          setIsSyncing(false);
          return;
        }

        if (res.status === 'ok' && res.user) {
          const actualUser = res.user as User;
          setInternalUser(actualUser);
          setIsSyncing(false);
        } else {
          setAuthError('An unexpected error occurred during login sync.');
          setIsSyncing(false);
        }
      }).catch((err) => {
        clearTimeout(failsafe);
        console.error("Failed to sync user:", err);
        setAuthError('An unexpected error occurred during sign-in verification.');
        setIsSyncing(false);
      });
    } else if (clerkLoaded && !clerkSignedIn) {
      setInternalUser(null);
      setIsSyncing(false);
    } else if (clerkLoaded && clerkSignedIn && !email) {
      setIsSyncing(false);
    }
  }, [clerkLoaded, clerkSignedIn, email]);

  const login = (role: UserRole) => {
    router.push('/sign-in');
  };

  const loginWithUser = (newUser: User) => {};

  const logout = () => {
    signOut(() => router.push('/sign-in'));
  };

  const fullyLoaded = clerkLoaded && !isSyncing;
  const isUnauthorized = fullyLoaded && clerkSignedIn && !internalUser;

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border border-gray-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">{authError}</p>
          <button 
            onClick={() => signOut(() => router.push('/sign-in'))}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isLoaded: fullyLoaded, 
      isSignedIn: !!internalUser, 
      isUnauthorized: !!isUnauthorized,
      user: internalUser, 
      login, 
      loginWithUser, 
      logout,
      clerkLoaded,
      clerkSignedIn: !!clerkSignedIn,
      hasClerkUser: !!clerkUser,
      isSyncing
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useUser = () => {
  const context = useContext(AuthContext);
  return { 
    isLoaded: context.isLoaded, 
    isSignedIn: context.isSignedIn, 
    user: context.user,
    clerkLoaded: context.clerkLoaded,
    clerkSignedIn: context.clerkSignedIn,
    hasClerkUser: context.hasClerkUser,
    isSyncing: context.isSyncing
  };
};

