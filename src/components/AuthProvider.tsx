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
}

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  isUnauthorized: boolean;
  user: User | null;
  realUser: User | null; // The actual logged in user, even if impersonating
  isImpersonating: boolean;
  impersonate: (userId: string) => void;
  stopImpersonating: () => void;
  login: (role: UserRole) => void;
  loginWithUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  isUnauthorized: false,
  user: null,
  realUser: null,
  isImpersonating: false,
  impersonate: () => {},
  stopImpersonating: () => {},
  login: () => {},
  loginWithUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded: clerkLoaded, isSignedIn: clerkSignedIn, user: clerkUser } = useClerkUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  const [internalUser, setInternalUser] = useState<User | null>(null);
  const [realUser, setRealUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [impersonatedId, setImpersonatedId] = useState<string | null>(null);

  // Load impersonation state from localStorage on mount
  useEffect(() => {
    const savedImp = localStorage.getItem('impersonate_id');
    if (savedImp) setImpersonatedId(savedImp);
  }, []);

  useEffect(() => {
    if (clerkLoaded && clerkSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      if (email) {
        setIsSyncing(true);
        syncUserByEmail(email).then((res) => {
          const actualUser = res.user as User | null;
          setRealUser(actualUser);
          
          if (actualUser && actualUser.role === 'superadmin' && impersonatedId) {
             // Fetch the impersonated user
             fetch(`/api/users/${impersonatedId}`).then(r => r.json()).then(impData => {
                if (impData.user) {
                  setInternalUser(impData.user);
                } else {
                  setInternalUser(actualUser);
                }
                setIsSyncing(false);
             }).catch(() => {
                setInternalUser(actualUser);
                setIsSyncing(false);
             });
          } else {
            if (actualUser) {
              setInternalUser(actualUser);
            } else {
              setInternalUser(null);
            }
            setIsSyncing(false);
          }
        }).catch((err) => {
          console.error("Failed to sync user:", err);
          setIsSyncing(false);
        });
      } else {
        setIsSyncing(false);
      }
    } else if (clerkLoaded && !clerkSignedIn) {
      setInternalUser(null);
      setRealUser(null);
      setIsSyncing(false);
    }
  }, [clerkLoaded, clerkSignedIn, clerkUser, impersonatedId]);

  const impersonate = (userId: string) => {
    if (realUser?.role === 'superadmin') {
      localStorage.setItem('impersonate_id', userId);
      setImpersonatedId(userId);
    }
  };

  const stopImpersonating = () => {
    localStorage.removeItem('impersonate_id');
    setImpersonatedId(null);
  };

  const login = (role: UserRole) => {
    router.push('/sign-in');
  };

  const loginWithUser = (newUser: User) => {};

  const logout = () => {
    signOut(() => router.push('/sign-in'));
  };

  const fullyLoaded = clerkLoaded && !isSyncing;
  const isUnauthorized = fullyLoaded && clerkSignedIn && !internalUser;

  return (
    <AuthContext.Provider value={{ 
      isLoaded: fullyLoaded, 
      isSignedIn: !!internalUser, 
      isUnauthorized: !!isUnauthorized,
      user: internalUser, 
      realUser,
      isImpersonating: !!impersonatedId && realUser?.role === 'superadmin',
      impersonate,
      stopImpersonating,
      login, 
      loginWithUser, 
      logout 
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
    realUser: context.realUser,
    isImpersonating: context.isImpersonating,
    impersonate: context.impersonate,
    stopImpersonating: context.stopImpersonating
  };
};

