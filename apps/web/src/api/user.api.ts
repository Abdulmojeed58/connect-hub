import type { ApiSuccess, PaginatedUsersResponse } from '@connecthub/shared-types';
import api from './axios';

export const userApi = {
  list: async (page = 1, limit = 20): Promise<PaginatedUsersResponse> => {
    const { data } = await api.get<ApiSuccess<PaginatedUsersResponse>>(
      `/api/users?page=${page}&limit=${limit}`,
    );
    return data.data;
  },
};
