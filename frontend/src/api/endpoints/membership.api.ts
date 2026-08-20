import type {
    AddMembership,
    SearchAllMemberships,
    SearchMyMemberships,
    UpdateMembership
} from "@/features/memberships/types.ts";
import {api} from "@/api/apiConfig.ts";

export const membershipApi = {
    searchAllMemberships: (searchAllMemberships: SearchAllMemberships) =>
        api.post('/memberships/all', searchAllMemberships),

    searchMyMemberships: (searchMyMemberships: SearchMyMemberships) =>
        api.post('/memberships/getMyMemberships', searchMyMemberships),

    addMembership: (data: AddMembership) =>
        api.post('/memberships/add', data),

    updateMembership: (date: UpdateMembership) =>
        api.patch('/memberships/update', date),
}