import {api} from "@/api/apiConfig.ts";

export const courseApi = {
    addCourse: (formData: FormData) => {
        return api.post('courses/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateCourse: (id: string, data: FormData) => {
        return api.patch(`courses/update/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteCourse: (id: string) => {
        return api.delete(`courses/delete/${id}`);
    }
}