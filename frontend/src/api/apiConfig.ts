import axios from 'axios';
import { getEnv } from '@/hooks/getEnv.ts'

const { dev } = getEnv();

export const api = axios.create({
    baseURL:  dev ? 'http://localhost:8081' : 'https://your-production-api.com',
    withCredentials: true  // ← This sends the httpOnly cookies automatically
});