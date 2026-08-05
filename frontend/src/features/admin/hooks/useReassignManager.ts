import {useMutation, useQueryClient} from "@tanstack/react-query";
import {clubApi} from "@/api/endpoints/club.api.ts";
import {toast} from "sonner";

export const useReassignManager = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clubApi.reassignClub,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['searchClubs'] });
            toast.success('Manager reassigned successfully');
        },
        onError: (err: any) => {
            toast.error('Failed to reassign manager: ' + err?.response?.data?.message || err.message);
        }
    })
}