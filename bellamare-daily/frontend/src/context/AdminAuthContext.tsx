import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ApiRequestError, api } from "../lib/api";

interface Admin {
  id: string;
  username: string;
}

interface AdminAuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ admin: Admin }>("/admin/me")
      .then((res) => setAdmin(res.admin))
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 401) setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const res = await api.post<{ admin: Admin }>("/admin/login", { username, password });
    setAdmin(res.admin);
  }

  async function logout() {
    await api.post("/admin/logout");
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth deve essere usato dentro AdminAuthProvider");
  return ctx;
}
