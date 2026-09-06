import type {
  AddEducationRequest,
  AddExperienceRequest,
  ApiSuccess,
  Education,
  Experience,
  ProfileResponse,
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

  addEducation: async (body: AddEducationRequest): Promise<Education> => {
    const { data } = await api.post<ApiSuccess<Education>>('/api/profiles/me/education', body);
    return data.data;
  },
};
