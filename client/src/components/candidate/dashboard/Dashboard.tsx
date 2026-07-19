import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
} from "lucide-react";

import StatCard from "./StatCard";
import RecentApplications from "./RecentApplications";
import ActivityTimeline from "./ActivityTimeline";

import Card from "../ui/Card";
import PageTitle from "../ui/PageTitle";
import Loader from "../ui/Loader";
import { getDashboard } from "../../../api/candidate/dashboard.api";
import { getApplications } from "../../../api/candidate/applications.api";
import type { DashboardData } from "../../../types/candidate";
import type { Application } from "../../../types/candidate";

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            getDashboard(),
            getApplications()
        ])
            .then(([dashboardData, appsData]) => {
                setData(dashboardData);
                setApplications(appsData);
            })
            .catch((err) =>
                setError(err instanceof Error ? err.message : "Failed to load dashboard")
            )
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error || !data) {
        return (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
                {error ?? "Failed to load dashboard"}
            </div>
        );
    }

    // Update stats with real application count
    const updatedStats = {
        ...data.stats,
        totalApplications: applications.length
    };

    return (
        <div className="space-y-8">
            <PageTitle
                title="Dashboard"
                subtitle="Welcome back! Here's your hiring activity."
            />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Applications"
                    value={String(updatedStats.totalApplications)}
                    icon={BriefcaseBusiness}
                    color="bg-blue-600"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Profile Completion
                    </h2>

                    <div className="h-3 w-full rounded-full bg-slate-700">
                        <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            style={{ width: `${data.profileCompletion}%` }}
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-slate-400">
                            Complete your profile to improve visibility.
                        </span>

                        <span className="font-bold text-blue-400">
                            {data.profileCompletion}%
                        </span>
                    </div>
                </Card>

                <Card>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Upcoming Interview
                    </h2>

                    {data.upcomingInterview ? (
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-white">
                                {data.upcomingInterview.role}
                            </h3>

                            <p className="text-slate-400">
                                {data.upcomingInterview.company}
                            </p>

                            <p className="font-medium text-blue-400">
                                {data.upcomingInterview.formattedDate ??
                                    `${data.upcomingInterview.date} • ${data.upcomingInterview.time}`}
                            </p>

                            <a
                                href={data.upcomingInterview.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                Join Meeting
                            </a>
                        </div>
                    ) : (
                        <p className="text-slate-400">No upcoming interviews.</p>
                    )}
                </Card>
            </div>

            <div className="space-y-6">
                <RecentApplications applications={applications} />
                <ActivityTimeline activities={data.activityTimeline ?? []} />
            </div>
        </div>
    );
}
