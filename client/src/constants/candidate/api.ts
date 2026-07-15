export const API = {
    BASE_URL: import.meta.env.VITE_API_URL || "/api",

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        ME: "/auth/me",
    },

    JOBS: "/jobs",
    APPLICATIONS: "/applications",
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    RESUME: "/resume",
    NOTIFICATIONS: "/notifications",
    INTERVIEWS: "/interviews",
};
