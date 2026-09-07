import { apiClient } from './client';
import type { Notification } from '../types';

export const notificationApi = {
  list: (): Promise<{ notifications: Notification[] }> =>
    apiClient.get('/api/notifications').then((r) => r.data.data),
};
