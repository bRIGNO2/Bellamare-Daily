import { Navigate } from "react-router-dom";
import { Spinner } from "./ui";
import { useAuth } from "../context/AuthContext";

export function RequireClientAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/benvenuto" replace />;
  return children;
}
