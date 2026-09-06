import type {
  ApiSuccess,
  ConnectionsListResponse,
  ConnectionWithProfiles,
  PendingRequestsResponse,
} from '@connecthub/shared-types';
import api from './axios';

export const connectionApi = {
  list: async (): Promise<ConnectionsListResponse> => {
    const { data } = await api.get<ApiSuccess<ConnectionsListResponse>>('/api/connections');
    return data.data;
  },

  pending: async (): Promise<PendingRequestsResponse> => {
    const { data } = await api.get<ApiSuccess<PendingRequestsResponse>>('/api/connections/pending');
    return data.data;
  },

  sent: async (): Promise<PendingRequestsResponse> => {
    const { data } = await api.get<ApiSuccess<PendingRequestsResponse>>('/api/connections/sent');
    return data.data;
  },

  sendRequest: async (userId: string): Promise<ConnectionWithProfiles> => {
    const { data } = await api.post<ApiSuccess<ConnectionWithProfiles>>(`/api/connections/request/${userId}`);
    return data.data;
  },

  accept: async (id: string): Promise<ConnectionWithProfiles> => {
    const { data } = await api.post<ApiSuccess<ConnectionWithProfiles>>(`/api/connections/${id}/accept`);
    return data.data;
  },

  decline: async (id: string): Promise<ConnectionWithProfiles> => {
    const { data } = await api.post<ApiSuccess<ConnectionWithProfiles>>(`/api/connections/${id}/decline`);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/api/connections/${id}`);
  },
};
