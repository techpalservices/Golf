import type { SearchMembershipRequests } from '@/features/memberships/types';
import { api } from '@/api/apiConfig';

export const membershipRequestApi = {
  searchAll: (data: SearchMembershipRequests) =>
    api.post('/memberships-requests/all', data),

  request: (membershipId: string) =>
    api.post(`/memberships-requests/request?membershipId=${membershipId}`),

  accept: (requestId: string) =>
    api.post(`/memberships-requests/accept?requestId=${requestId}`),

  reject: (requestId: string) =>
    api.post(`/memberships-requests/reject?requestId=${requestId}`),
};
