// context/AuthContext.tsx
// Estado global de sesión con Context API (sin Redux, como exige el enunciado).
// Persiste user + token en sessionStorage para sobrevivir refrescos de página.
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Usuario } from '../types';
import * as authService from '../services/authService';

const TOKEN_KEY = 'sena_spacehub_token';
const USER_KEY = 'sena_spacehub_user';

interface AuthContextValue {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    const storedUser = sessionStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { accessToken, user: loggedUser } = await authService.login(email, password);
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    setToken(accessToken);
    setUser(loggedUser);
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // Aunque falle la llamada al servidor, igual cerramos sesión localmente.
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  return ctx;
}
