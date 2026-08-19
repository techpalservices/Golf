import {useMutation, useQueryClient} from "@tanstack/react-query";
import {courseApi} from "@/api/endpoints/course.api.ts";
import {toast} from "sonner";

export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => courseApi.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getMyClub'] });
            toast.success('Course deleted successfully', { duration: 5000 });
        },
        onError: (err: any) => {
            toast.error('Failed to delete course: ' + (err?.response?.data?.message ?? err.message));
        }
    })
}