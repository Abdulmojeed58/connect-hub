import { apiClient } from './client';
import type { PaginatedUsers } from '../types';

export const userApi = {
  list: (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedUsers> =>
    apiClient.get('/api/users', { params }).then((r) => r.data.data),
};
