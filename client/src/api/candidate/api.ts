import axios, { isAxiosError } from "axios";
import { TOKEN_KEY } from "../shared/client";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "/api"}/candidates`,
    headers: {
        "Content-Type": "application/json",
    },
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error)) {
            const message =
                (error.response?.data as { message?: string } | undefined)
                    ?.message || error.message;

            return Promise.reject(new Error(message));
        }

        return Promise.reject(error);
    }
);

export default api;
