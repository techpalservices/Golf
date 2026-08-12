import {api} from "@/api/apiConfig.ts";

export const courseApi = {
    addCourse: (formData: FormData) => {
        return api.post('courses/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}