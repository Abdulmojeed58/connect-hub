import type { ApiSuccess, NotificationsListResponse } from '@connecthub/shared-types';
import api from './axios';

export const notificationApi = {
  list: async (): Promise<NotificationsListResponse> => {
    const { data } = await api.get<ApiSuccess<NotificationsListResponse>>('/api/notifications');
    return data.data;
  },
};
