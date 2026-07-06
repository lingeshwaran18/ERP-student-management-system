'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  rollNumber?: string;
  employeeId?: string;
  designation?: string;
  department?: { name: string; code: string };
  course?: { name: string; code: string };
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'STUDENT' | 'FACULTY' | 'PARENT';
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token and restore user session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('erp_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          localStorage.removeItem('erp_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('erp_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('erp_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
