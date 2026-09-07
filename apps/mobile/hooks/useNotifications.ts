import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
    staleTime: 1000 * 60 * 2,
  });
}
