import { useMutation, useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile.api';
import { queryClient } from '@/lib/query-client';

export const profileQueryKey = (userId: string) => ['profile', userId] as const;

export function useProfile(userId: string) {
  return useQuery({
    queryKey: profileQueryKey(userId),
    queryFn: () => profileApi.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useUpdateProfile(userId: string) {
  return useMutation({
    mutationFn: profileApi.updateOwn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
    },
  });
}

export function useAddExperience(userId: string) {
  return useMutation({
    mutationFn: profileApi.addExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
    },
  });
}

export function useAddEducation(userId: string) {
  return useMutation({
    mutationFn: profileApi.addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
    },
  });
}
