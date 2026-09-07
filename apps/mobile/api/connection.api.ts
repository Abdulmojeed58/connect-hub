import { apiClient } from './client';
import type { Connection } from '../types';

export const connectionApi = {
  list: (search?: string): Promise<{ connections: Connection[] }> =>
    apiClient
      .get('/api/connections', { params: search ? { search } : {} })
      .then((r) => r.data.data),

  pending: (search?: string): Promise<{ requests: Connection[] }> =>
    apiClient
      .get('/api/connections/pending', { params: search ? { search } : {} })
      .then((r) => r.data.data),

  sent: (): Promise<{ requests: Connection[] }> =>
    apiClient.get('/api/connections/sent').then((r) => r.data.data),

  sendRequest: (userId: string): Promise<Connection> =>
    apiClient.post(`/api/connections/request/${userId}`).then((r) => r.data.data),

  accept: (id: string): Promise<Connection> =>
    apiClient.post(`/api/connections/${id}/accept`).then((r) => r.data.data),

  decline: (id: string): Promise<Connection> =>
    apiClient.post(`/api/connections/${id}/decline`).then((r) => r.data.data),

  remove: (id: string): Promise<void> =>
    apiClient.delete(`/api/connections/${id}`),
};
