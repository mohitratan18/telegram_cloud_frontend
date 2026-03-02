'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { config } from './config';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      await axios.get(`${config.apiUrl}/verify`, {
        headers: { Authorization: `Bearer ${tokenToVerify}` }
      });
      setToken(tokenToVerify);
    } catch (error) {
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${config.apiUrl}/login`, {
        username,
        password
      });
      const { token: newToken } = response.data;
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      } else if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  const logout = async () => {
    if (!token) return;
    try {
      await axios.post(`${config.apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      isAuthenticated: !!token,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
