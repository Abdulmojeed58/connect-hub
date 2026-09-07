import { apiClient } from './client';
import type { Profile } from '../types';

export const profileApi = {
  getByUserId: (userId: string): Promise<Profile> =>
    apiClient.get(`/api/profiles/${userId}`).then((r) => r.data.data),

  updateOwn: (
    data: Partial<{
      fullName: string;
      headline: string;
      bio: string;
      location: string;
      photoUrl: string;
    }>,
  ): Promise<Profile> =>
    apiClient.put('/api/profiles/me', data).then((r) => r.data.data),

  addExperience: (data: {
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }) => apiClient.post('/api/profiles/me/experience', data).then((r) => r.data.data),

  updateExperience: (
    id: string,
    data: {
      company: string;
      title: string;
      startDate: string;
      endDate?: string;
      description?: string;
    },
  ) => apiClient.put(`/api/profiles/me/experience/${id}`, data).then((r) => r.data.data),

  deleteExperience: (id: string) => apiClient.delete(`/api/profiles/me/experience/${id}`),

  addEducation: (data: { school: string; degree: string; field: string; year: number }) =>
    apiClient.post('/api/profiles/me/education', data).then((r) => r.data.data),

  updateEducation: (
    id: string,
    data: { school: string; degree: string; field: string; year: number },
  ) => apiClient.put(`/api/profiles/me/education/${id}`, data).then((r) => r.data.data),

  deleteEducation: (id: string) => apiClient.delete(`/api/profiles/me/education/${id}`),
};
