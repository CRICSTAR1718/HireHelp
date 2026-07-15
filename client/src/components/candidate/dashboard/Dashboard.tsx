import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    FileText,
    CalendarDays,
    Bell,
} from "lucide-react";

import StatCard from "./StatCard";
import RecentApplications from "./RecentApplications";
import RecommendedJobs from "./RecommendedJobs";
import ActivityTimeline from "./ActivityTimeline";
import NotificationsPanel from "./NotificationsPanel";

import Card from "../ui/Card";
import PageTitle from "../ui/PageTitle";
import Loader from "../ui/Loader";
import { getDashboard } from "../../../api/candidate/dashboard.api";
import type { DashboardData } from "../../../types/candidate";

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const resumeStatus =
        data?.resumeStatus ?? ({
            uploaded: false,
            score: 0,
            fileName: null,
            lastUpdated: null,
        } as DashboardData["resumeStatus"]);


    useEffect(() => {
        getDashboard()
            .then(setData)
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

    return (
        <div className="space-y-8">
            <PageTitle
                title="Dashboard"
                subtitle="Welcome back! Here's your hiring activity."
            />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Applications"
                    value={String(data.stats.totalApplications)}
                    icon={BriefcaseBusiness}
                    color="bg-blue-600"
                />

                <StatCard
                    title="Resume Score"
                    value={`${data.stats.resumeScore}%`}
                    icon={FileText}
                    color="bg-green-600"
                />

                <StatCard
                    title="Interviews"
                    value={String(data.stats.interviewsScheduled)}
                    icon={CalendarDays}
                    color="bg-purple-600"
                />

                <StatCard
                    title="Notifications"
                    value={String(data.stats.unreadNotifications)}
                    icon={Bell}
                    color="bg-orange-600"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
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

                <Card>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Resume Status
                    </h2>

                    <div className="space-y-3">
                        <p className="font-semibold text-green-400">
                            {resumeStatus.uploaded
                                ? "✓ Resume Uploaded"
                                : "No resume uploaded yet"}
                        </p>

                        {resumeStatus.uploaded && (
                            <>
                                <p className="text-slate-400">
                                    ATS Score:{" "}
                                    <span className="font-semibold text-white">
                                        {resumeStatus.score}%
                                    </span>
                                </p>

                                <p className="text-slate-400">
                                    {resumeStatus.fileName}
                                </p>
                            </>
                        )}
                    </div>

                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <RecentApplications applications={data.recentApplications ?? []} />
                    <RecommendedJobs jobs={data.recommendedJobs ?? []} />
                    <ActivityTimeline activities={data.activityTimeline ?? []} />




                </div>

                <div>
                    <NotificationsPanel notifications={data.notifications ?? []} />
                </div>
            </div>
        </div>
    );
}
