import { useMutation, useQuery } from '@tanstack/react-query';
import { connectionApi } from '@/api/connection.api';
import { queryClient } from '@/lib/query-client';

const CONNECTIONS_KEY = ['connections'] as const;
const PENDING_KEY = ['connections', 'pending'] as const;

export function useConnections() {
  return useQuery({ queryKey: CONNECTIONS_KEY, queryFn: connectionApi.list });
}

export function usePendingRequests() {
  return useQuery({ queryKey: PENDING_KEY, queryFn: connectionApi.pending });
}

export function useSendConnectionRequest() {
  return useMutation({
    mutationFn: connectionApi.sendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
    },
  });
}

export function useAcceptConnection() {
  return useMutation({
    mutationFn: connectionApi.accept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: PENDING_KEY });
    },
  });
}

export function useDeclineConnection() {
  return useMutation({
    mutationFn: connectionApi.decline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_KEY });
    },
  });
}

export function useRemoveConnection() {
  return useMutation({
    mutationFn: connectionApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY });
    },
  });
}
