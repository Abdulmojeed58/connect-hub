import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

export function useUsers(page = 1, limit = 20, search?: string) {
  return useQuery({
    queryKey: ['users', page, limit, search ?? ''],
    queryFn: () => userApi.list(page, limit, search),
  });
}
