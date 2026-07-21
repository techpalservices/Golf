import * as axios from "axios";
import { getEnv } from "@/hooks/getEnv.ts";

const { dev } = getEnv();

export const apiClient = axios.create({
    baseURL: dev.server,
    withCredentials: true,
});
