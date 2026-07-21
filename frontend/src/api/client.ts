import * as axios from "axios";
import {useEnv} from "@/hooks/useEnv.ts";

const { dev } = useEnv()

export const apiClient = axios.create({
    baseURL: dev.server,
    withCredentials: true
})