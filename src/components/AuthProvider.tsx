"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser as useClerkUser, useClerk } from '@clerk/nextjs';
import { syncUserByEmail } from '@/app/actions/agent';
import { useRouter } from 'next/navigation';

export type UserRole = 'agent' | 'admin';

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
  login: (role: UserRole) => void;
  loginWithUser: (user: User) => void;
  logout: () => void;
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

  useEffect(() => {
    if (clerkLoaded && clerkSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      if (email) {
        syncUserByEmail(email).then((res) => {
          if (res.user) {
            setInternalUser(res.user as User);
          } else {
            // Unrecognized user. Clerk logged them in, but they aren't in our DB.
            setInternalUser(null);
          }
          setIsSyncing(false);
        });
      }
    } else if (clerkLoaded && !clerkSignedIn) {
      setInternalUser(null);
      setIsSyncing(false);
    }
  }, [clerkLoaded, clerkSignedIn, clerkUser]);

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
  return { isLoaded: context.isLoaded, isSignedIn: context.isSignedIn, user: context.user };
};

