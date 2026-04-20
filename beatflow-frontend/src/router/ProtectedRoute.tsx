import { Navigate } from "react-router-dom";
import { useAuthStore } from "../app/store";
import type { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

export default function ProtectedRoute({ children }: Props) {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
