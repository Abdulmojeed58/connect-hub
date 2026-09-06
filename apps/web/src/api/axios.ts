import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
  baseURL: import.meta.env['VITE_API_BASE_URL'] ?? '',
  headers: { 'Content-Type': 'application/json' },
});

// Inject access token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Queue of requests waiting for a token refresh to complete
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
}

// On 401: attempt silent refresh, then retry; only redirect if refresh fails
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Don't try to refresh if this was already a retry or it's the refresh endpoint itself
    const isRefreshCall = originalRequest.url?.includes('/api/auth/refresh');
    if (error.response?.status !== 401 || originalRequest._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

    if (!refreshToken) {
      clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another request is already refreshing — wait for it to finish
      return new Promise<string>((resolve) => {
        refreshQueue.push(resolve);
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{
        success: boolean;
        data: { accessToken: string; refreshToken: string };
      }>(
        `${import.meta.env['VITE_API_BASE_URL'] ?? ''}/api/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const { accessToken: newAccess, refreshToken: newRefresh } = data.data;
      setTokens(newAccess, newRefresh);
      processQueue(newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    } catch {
      clearAuth();
      refreshQueue = [];
      window.location.href = '/login';
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
