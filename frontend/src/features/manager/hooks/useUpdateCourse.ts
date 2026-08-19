import {useMutation, useQueryClient} from "@tanstack/react-query";
import {courseApi} from "@/api/endpoints/course.api.ts";
import {toast} from "sonner";

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => courseApi.updateCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getMyClub'] });
            toast.success('Course updated successfully', { duration: 5000 });
        },
        onError: (err: any) => {
            toast.error('Failed to update course: ' + (err?.response?.data?.message ?? err.message));
        }
    })
}