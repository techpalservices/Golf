import axios from 'axios';
import { getEnv } from '@/hooks/getEnv.ts'

const { dev } = getEnv();

export const api = axios.create({
    baseURL:  dev.server,
    withCredentials: true  // sends the httpOnly cookies automatically
});

let isRefreshing = false;

let failedQueue : Array< {
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(undefined);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if(err.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url === '/auth/refreshToken' ||
            originalRequest.url === '/login') {
            return Promise.reject(err);
        }

        if (isRefreshing) {
            return new Promise((resolve,reject) => {
                failedQueue.push({resolve,reject});
            }).then(() => {
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post(('/auth/refreshToken'));
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            // A failed /auth/me probe just means "guest user" — public pages must
            // stay usable without auth. Real session failures elsewhere still redirect.
            if (originalRequest.url !== '/auth/me') {
                window.location.href = '/login';
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
)