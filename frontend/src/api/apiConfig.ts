import axios from 'axios';
import { getEnv } from '@/hooks/getEnv.ts'

const { dev } = getEnv();

export const api = axios.create({
    baseURL:  dev.server,
    withCredentials: true  // sends the httpOnly cookies automatically
});