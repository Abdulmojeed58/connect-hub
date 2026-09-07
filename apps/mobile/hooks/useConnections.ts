import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectionApi } from '../api/connection.api';

export function useConnections(search?: string) {
  return useQuery({
    queryKey: ['connections', search],
    queryFn: () => connectionApi.list(search),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePendingConnections(search?: string) {
  return useQuery({
    queryKey: ['connections-pending', search],
    queryFn: () => connectionApi.pending(search),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSentConnections() {
  return useQuery({
    queryKey: ['connections-sent'],
    queryFn: () => connectionApi.sent(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => connectionApi.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections-sent'] });
    },
  });
}

export function useAcceptConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionApi.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections-pending'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useDeclineConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionApi.decline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections-pending'] });
    },
  });
}

export function useRemoveConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}
