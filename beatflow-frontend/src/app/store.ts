import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  email: string | null;
  setAuth: (payload: {
    accessToken: string | null;
    email: string | null;
  }) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      email: null,

      setAuth: ({ accessToken, email }) => set({ accessToken, email }),

      setAccessToken: (token) => set({ accessToken: token }),

      clearAuth: () => set({ accessToken: null, email: null }),
    }),
    {
      name: "beatflow-auth",
    },
  ),
);
