import {useMutation, useQueryClient} from "@tanstack/react-query";
import {courseApi} from "@/api/endpoints/course.api.ts";
import {toast} from "sonner";

export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: courseApi.addCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getMyClub'] });
            toast.success('Course created successfully', { duration: 5000 });
        },
        onError: (err: any) => {
            toast.error('Failed to create course: ' + (err?.response?.data?.message ?? err.message));
        }
    })
}