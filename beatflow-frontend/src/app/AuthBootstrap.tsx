import { useEffect, useState } from "react";
import { refresh } from "../api/auth";
import { useAuthStore } from "./store";

type Props = {
  children: React.ReactNode;
};

export default function AuthBootstrap({ children }: Props) {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await refresh();
        setAccessToken(response.accessToken);
      } catch {
        clearAuth();
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, [setAccessToken, clearAuth]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
