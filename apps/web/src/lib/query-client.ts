import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (axios.isAxiosError(error) && error.response && error.response.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
