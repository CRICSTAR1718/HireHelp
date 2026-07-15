import api from "./api";
import type { DashboardData } from "../../types/candidate";

export async function getDashboard(): Promise<DashboardData> {
    // Backend exposes:
    //   GET /api/dashboard/overview
    //   GET /api/dashboard/stats
    const response = await api.get<DashboardData>("/dashboard/overview");
    return response.data;
}

