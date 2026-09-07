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

export function useUpdateExperience(userId: string) {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Parameters<typeof profileApi.updateExperience>[1]) =>
      profileApi.updateExperience(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
    },
  });
}

export function useDeleteExperience(userId: string) {
  return useMutation({
    mutationFn: profileApi.deleteExperience,
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

export function useUpdateEducation(userId: string) {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Parameters<typeof profileApi.updateEducation>[1]) =>
      profileApi.updateEducation(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
    },
  });
}

export function useDeleteEducation(userId: string) {
  return useMutation({
    mutationFn: profileApi.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
    },
  });
}
