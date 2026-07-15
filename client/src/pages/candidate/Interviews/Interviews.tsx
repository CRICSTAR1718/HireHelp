import { useEffect, useState } from "react";

import PageTitle from "../../../components/candidate/ui/PageTitle";
import InterviewList from "../../../components/candidate/interviews/InterviewList";
import PreparationCard from "../../../components/candidate/interviews/PreparationCard";
import InterviewStats from "../../../components/candidate/interviews/InterviewStats";
import InterviewTimeline from "../../../components/candidate/interviews/InterviewTimeline";
import Loader from "../../../components/candidate/ui/Loader";
import { getInterviews, getInterviewStats } from "../../../api/candidate/interviews.api";
import type { Interview, InterviewStats as InterviewStatsType } from "../../../types/candidate";

export default function Interviews() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [stats, setStats] = useState<InterviewStatsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getInterviews(), getInterviewStats()])
            .then(([interviewData, statsData]) => {
                setInterviews(interviewData);
                setStats(statsData);
            })
            .catch((err) =>
                setError(err instanceof Error ? err.message : "Failed to load interviews")
            )
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageTitle
                title="Interviews"
                subtitle="Manage your upcoming interviews."
            />

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-6">
                    <InterviewList interviews={interviews} />
                </div>

                <div className="space-y-6">
                    {stats && <InterviewStats stats={stats} />}
                    <PreparationCard />
                    <InterviewTimeline interviews={interviews} />
                </div>
            </div>
        </div>
    );
}
