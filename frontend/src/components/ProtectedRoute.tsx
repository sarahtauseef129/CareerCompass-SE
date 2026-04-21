import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/services/storageService";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
