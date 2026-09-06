import type { ApiSuccess, PaginatedUsersResponse } from '@connecthub/shared-types';
import api from './axios';

export const userApi = {
  list: async (page = 1, limit = 20, search?: string): Promise<PaginatedUsersResponse> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search?.trim()) params.set('search', search.trim());
    const { data } = await api.get<ApiSuccess<PaginatedUsersResponse>>(
      `/api/users?${params.toString()}`,
    );
    return data.data;
  },
};
