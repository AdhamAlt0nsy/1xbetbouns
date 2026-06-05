import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  accountId: string;
  role: 'player' | 'admin';
  name: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (accountId: string, role: 'player' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('agency_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback((accountId: string, role: 'player' | 'admin') => {
    const userData: User = {
      accountId,
      role,
      name: role === 'admin' ? 'Admin User' : `Player ${accountId.slice(-4)}`,
      balance: role === 'player' ? 1250.00 : 0,
    };
    setUser(userData);
    localStorage.setItem('agency_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('agency_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
