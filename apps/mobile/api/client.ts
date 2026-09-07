import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach access token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(`→ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data ?? '');
  return config;
});

// Log responses (skip 401 — auto-refresh interceptor handles those silently)
apiClient.interceptors.response.use(
  (res) => {
    console.log(`← ${res.status} ${res.config.url}`, res.data);
    return res;
  },
  (error) => {
    if (error.response?.status !== 401) {
      console.log(`← ERROR ${error.response?.status} ${error.config?.url}`, error.response?.data);
    }
    return Promise.reject(error);
  },
);

// Auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
      const { accessToken: newAccess, refreshToken: newRefresh, userId } = data.data;
      await setTokens(newAccess, newRefresh, userId);

      processQueue(null, newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch (err) {
      processQueue(err, null);
      await useAuthStore.getState().clearTokens();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
