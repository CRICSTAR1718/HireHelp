import axios, { isAxiosError } from "axios";
import { TOKEN_KEY } from "../shared/client";
import { toUserMessage } from "../../utils/toUserMessage";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "/api"}/candidates`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error)) {
            const message = toUserMessage(error, "Something went wrong. Please try again.");
            return Promise.reject(new Error(message));
        }

        return Promise.reject(error);
    }
);

export default api;

