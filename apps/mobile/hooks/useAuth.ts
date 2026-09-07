import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const userId = useAuthStore((s) => s.userId);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setTokens = useAuthStore((s) => s.setTokens);
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const loadTokens = useAuthStore((s) => s.loadTokens);

  return {
    accessToken,
    refreshToken,
    userId,
    isLoading,
    isAuthenticated: !!accessToken,
    setTokens,
    clearTokens,
    loadTokens,
  };
}
