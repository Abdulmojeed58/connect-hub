import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'connecthub_access_token';
const REFRESH_KEY = 'connecthub_refresh_token';
const USER_ID_KEY = 'connecthub_user_id';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isLoading: boolean;
  setTokens: (accessToken: string, refreshToken: string, userId: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  loadTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  userId: null,
  isLoading: true,

  setTokens: async (accessToken, refreshToken, userId) => {
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
    await SecureStore.setItemAsync(USER_ID_KEY, userId);
    set({ accessToken, refreshToken, userId });
  },

  clearTokens: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
    set({ accessToken: null, refreshToken: null, userId: null });
  },

  loadTokens: async () => {
    const [accessToken, refreshToken, userId] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
      SecureStore.getItemAsync(USER_ID_KEY),
    ]);
    set({ accessToken, refreshToken, userId, isLoading: false });
  },
}));
