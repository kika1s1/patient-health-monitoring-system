import axios, { AxiosInstance } from "axios";

interface ImportMetaEnv {
    VITE_NODE_ENV: string;
    VITE_API_URL: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}

export const axiosInstance: AxiosInstance = axios.create({
    baseURL:
        import.meta.env.VITE_NODE_ENV === "development"
            ? import.meta.env.VITE_API_URL
            : "/api/v1",
            withCredentials: true,
});
