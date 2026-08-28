import { api } from '@/api/apiConfig';

export type TournamentStatus = 'ACTIVE'|'PENDING'|'COMPLETED'|'CANCELED';

export interface TournamentResponse {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  clubName: string;
  status: TournamentStatus;
  imageUrl?: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
}

export const tournamentApi = {
  search: (params: { q?: string; status?: string; location?: string; page?: number; size?: number }) =>
    api.post('/tournaments/search', params).then(res => res.data?.data),
  // Public search — works for unauthenticated visitors, returns ACTIVE tournaments (plus COMPLETED/CANCELED if filtered)
  publicSearch: (params: { q?: string; status?: string; location?: string; date?: string; page?: number; size?: number }) =>
    api.post('/tournaments/public-search', params).then(res => res.data?.data),
  create: (data: any) => api.post('/tournaments', data).then(res => res.data?.data),
  update: (data: any) => api.put('/tournaments', data).then(res => res.data?.data),
  delete: (id: string) => api.delete(`/tournaments/${id}`).then(res => res.data?.data),
};
