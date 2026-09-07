import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi } from '../api/user.api';

const LIMIT = 20;

export function useUsers(search: string) {
  return useInfiniteQuery({
    queryKey: ['users', search],
    queryFn: ({ pageParam = 1 }) =>
      userApi.list({ page: pageParam as number, limit: LIMIT, search: search || undefined }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / LIMIT);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}
