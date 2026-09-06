import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  ApiSuccess,
} from '@connecthub/shared-types';
import api from './axios';

export const authApi = {
  register: async (body: RegisterRequest): Promise<LoginResponse> => {
    const { data } = await api.post<ApiSuccess<LoginResponse>>('/api/auth/register', body);
    return data.data;
  },

  login: async (body: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<ApiSuccess<LoginResponse>>('/api/auth/login', body);
    return data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/api/auth/logout', { refreshToken });
  },

  me: async (): Promise<MeResponse> => {
    const { data } = await api.get<ApiSuccess<MeResponse>>('/api/auth/me');
    return data.data;
  },
};
