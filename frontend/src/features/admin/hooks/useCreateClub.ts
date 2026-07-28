import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {clubApi} from "@/api/endpoints/club.api.ts";

export const useCreateClub = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clubApi.addClub,
        onSuccess: () => {
            //reset the store cache with the new data
            queryClient.invalidateQueries({ queryKey: ['getAllClubs'] });
            toast.success('Club created');
        },
        onError: (err: any) => {
            toast.error('Failed to create club: ' + err?.response?.data?.message || err.message);
        }
    })
}