import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MeResponse } from '@connecthub/shared-types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: MeResponse | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setCurrentUser: (user: MeResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      currentUser: null,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

      setCurrentUser: (currentUser) => set({ currentUser }),

      clearAuth: () => set({ accessToken: null, refreshToken: null, currentUser: null }),
    }),
    {
      name: 'connecthub-auth',
      // Only persist tokens — user data is re-fetched on load
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
