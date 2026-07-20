import { Navigate } from "react-router-dom";
import { Spinner } from "./ui";
import { useAdminAuth } from "../context/AdminAuthContext";

export function RequireAdminAuth({ children }: { children: JSX.Element }) {
  const { admin, loading } = useAdminAuth();

  if (loading) return <Spinner />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
