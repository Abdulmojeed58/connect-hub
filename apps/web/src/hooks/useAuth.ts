import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/store/auth.store';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

/** Fetch and cache the current user. Only runs when an access token exists. */
export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.me,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLogin() {
  const { setTokens } = useAuthStore();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useRegister() {
  const { setTokens } = useAuthStore();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useLogout() {
  const { refreshToken, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => authApi.logout(refreshToken ?? ''),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });
}
