import {api} from "@/api/apiConfig.ts";
import type {ApiResponse} from "@/features/auth/types.ts";
import type {Club, CreateClub, UpdateClub} from "@/features/clubs/types.ts";

export const clubApi = {
    getAllClubs: ({ page = 0, size = 10}) =>
        api.post<ApiResponse<Club[]>>('/clubs/all', { page, size }),

    addClub: (data: CreateClub) =>
        api.post('/clubs/add', data),

    updateClub: (data: UpdateClub) =>
        api.patch('/clubs/update', data),

    changeClubStatus: ({ clubId, status }: { clubId: string; status: string }) =>
        api.patch(`/clubs/change-status`, null, { params: { clubId, status } }),
}