import type {
  AddEducationRequest,
  AddExperienceRequest,
  ApiSuccess,
  Education,
  Experience,
  ProfileResponse,
  UpdateEducationRequest,
  UpdateExperienceRequest,
  UpdateProfileRequest,
} from '@connecthub/shared-types';
import api from './axios';

export const profileApi = {
  getByUserId: async (userId: string): Promise<ProfileResponse> => {
    const { data } = await api.get<ApiSuccess<ProfileResponse>>(`/api/profiles/${userId}`);
    return data.data;
  },

  updateOwn: async (body: UpdateProfileRequest): Promise<ProfileResponse> => {
    const { data } = await api.put<ApiSuccess<ProfileResponse>>('/api/profiles/me', body);
    return data.data;
  },

  addExperience: async (body: AddExperienceRequest): Promise<Experience> => {
    const { data } = await api.post<ApiSuccess<Experience>>('/api/profiles/me/experience', body);
    return data.data;
  },

  updateExperience: async (id: string, body: UpdateExperienceRequest): Promise<Experience> => {
    const { data } = await api.put<ApiSuccess<Experience>>(`/api/profiles/me/experience/${id}`, body);
    return data.data;
  },

  deleteExperience: async (id: string): Promise<void> => {
    await api.delete(`/api/profiles/me/experience/${id}`);
  },

  addEducation: async (body: AddEducationRequest): Promise<Education> => {
    const { data } = await api.post<ApiSuccess<Education>>('/api/profiles/me/education', body);
    return data.data;
  },

  updateEducation: async (id: string, body: UpdateEducationRequest): Promise<Education> => {
    const { data } = await api.put<ApiSuccess<Education>>(`/api/profiles/me/education/${id}`, body);
    return data.data;
  },

  deleteEducation: async (id: string): Promise<void> => {
    await api.delete(`/api/profiles/me/education/${id}`);
  },
};
