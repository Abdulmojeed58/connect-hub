import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

export function useUsers(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => userApi.list(page, limit),
  });
}
