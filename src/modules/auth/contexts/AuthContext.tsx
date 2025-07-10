'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { AuthContextType, User, LoginRequest } from '../types';
import { useLogin } from '../hooks/useAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { login: loginFn } = useLogin();

  const logout = React.useCallback(() => {
    setUser(null);
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
  }, []);

  const checkTokenValidity = React.useCallback(async () => {
    const token = Cookies.get('auth_token');
    if (!token) {
      logout();
      return false;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        logout();
        toast.warning('Sua sessão expirou. Você foi desconectado automaticamente.');
        return false;
      }

      return true;
    } catch {
      logout();
      toast.warning('Sua sessão expirou. Você foi desconectado automaticamente.');
      return false;
    }
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('auth_token');
      const userData = Cookies.get('user_data');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          const isValid = await checkTokenValidity();
          if (isValid) {
            setUser(parsedUser);
          }
        } catch {
          logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [checkTokenValidity, logout]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        checkTokenValidity();
      }, 30 * 1000);

      return () => clearInterval(interval);
    }
  }, [user, checkTokenValidity]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const trimmedCredentials = {
        ...credentials,
        username: credentials.username.trim()
      };
      const response = await loginFn(trimmedCredentials);
      
      if (response.success) {
        setUser(response.user);
        Cookies.set('auth_token', response.token, { expires: 1/144 });
        Cookies.set('user_data', JSON.stringify(response.user), { expires: 1/144 });
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Erro ao fazer login';
      toast.error(errorMessage);
      throw error;
    }
  }, [loginFn]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    isAuthenticated
  }), [user, isLoading, login, logout, isAuthenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
