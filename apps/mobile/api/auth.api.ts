import { apiClient } from './client';

export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    apiClient.post('/api/auth/register', data).then((r) => r.data.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post('/api/auth/login', data).then((r) => r.data.data),

  logout: (refreshToken: string) =>
    apiClient.post('/api/auth/logout', { refreshToken }),

  me: () =>
    apiClient.get('/api/auth/me').then((r) => r.data.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/api/auth/change-password', data),

  forgotPassword: (email: string) =>
    apiClient.post('/api/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    apiClient.post('/api/auth/reset-password', data),
};
