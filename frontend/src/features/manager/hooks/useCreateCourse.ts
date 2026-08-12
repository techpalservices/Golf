import {useMutation, useQueryClient} from "@tanstack/react-query";
import {courseApi} from "@/api/endpoints/course.api.ts";
import {toast} from "sonner";

export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: courseApi.addCourse,
        onSuccess: () => {
            //reset the store cache with the new data
            queryClient.invalidateQueries({ queryKey: ['searchClubs'] });
            toast.success('Club created');
        },
        onError: (err: any) => {
            toast.error('Failed to create club: ' + (err?.response?.data?.message ?? err.message));
        }
    })
}