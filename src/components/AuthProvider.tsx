"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate initial load from localStorage for the PoC
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, []);

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: role === 'admin' ? 'user_admin123' : 'user_agent456',
      name: role === 'admin' ? 'Everett Admin' : 'Agent Smith',
      email: role === 'admin' ? 'everett@foreverflorida.com' : 'smith@agent.com',
      role: role,
    };
    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useUser = () => {
  const context = useContext(AuthContext);
  return { isLoaded: context.isLoaded, isSignedIn: context.isSignedIn, user: context.user };
};
