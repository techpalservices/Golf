import {useMutation, useQueryClient} from "@tanstack/react-query";
import {clubApi} from "@/api/endpoints/club.api.ts";
import {toast} from "sonner";

export const useChangeClubStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clubApi.changeClubStatus,
        onSuccess: () => {
            //reset the store cache with the new data
            queryClient.invalidateQueries({ queryKey: ['changeClubStatus'] });
            toast.success('Club status updated');
        },
        onError: (err: any) => {
            toast.error('Failed to update club status: ' + err?.response?.data?.message || err.message);
        }
    })
}