import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ApiRequestError, api } from "../lib/api";
import { User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  register: (data: { nome: string; piazzola: string; cognome?: string; telefono?: string }) => Promise<void>;
  updateProfile: (data: Partial<Pick<User, "nome" | "cognome" | "telefono" | "piazzola">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await api.get<{ user: User }>("/auth/me");
      setUser(data.user);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function register(data: { nome: string; piazzola: string; cognome?: string; telefono?: string }) {
    const res = await api.post<{ user: User }>("/auth/register", data);
    setUser(res.user);
  }

  async function updateProfile(data: Partial<Pick<User, "nome" | "cognome" | "telefono" | "piazzola">>) {
    const res = await api.put<{ user: User }>("/auth/me", data);
    setUser(res.user);
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}
