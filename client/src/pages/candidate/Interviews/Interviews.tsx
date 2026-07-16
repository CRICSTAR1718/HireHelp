import { useEffect, useState } from "react";

import PageTitle from "../../../components/candidate/ui/PageTitle";
import InterviewList from "../../../components/candidate/interviews/InterviewList";
import PreparationCard from "../../../components/candidate/interviews/PreparationCard";
import InterviewStats from "../../../components/candidate/interviews/InterviewStats";
import InterviewTimeline from "../../../components/candidate/interviews/InterviewTimeline";
import Loader from "../../../components/candidate/ui/Loader";
import { getInterviews, getInterviewStats, getUpcomingInterviews } from "../../../api/candidate/interviews.api";
import type { Interview, InterviewStats as InterviewStatsType } from "../../../types/candidate";

export default function Interviews() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
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

    // Load upcoming interviews with meeting links
    useEffect(() => {
        const candidateId = localStorage.getItem('candidateId'); // Assuming candidate ID is stored
        if (candidateId) {
            getUpcomingInterviews(candidateId)
                .then(data => setUpcomingInterviews(data))
                .catch(err => console.error('Failed to load upcoming interviews:', err));
        }
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

            {/* Upcoming Interviews with Meeting Links */}
            {upcomingInterviews.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
                    <div className="space-y-4">
                        {upcomingInterviews.map((interview) => (
                            <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{new Date(interview.startTime).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">Duration: {Math.round((new Date(interview.endTime).getTime() - new Date(interview.startTime).getTime()) / 60000)} minutes</p>
                                </div>
                                {interview.meetingLink && (
                                    <a
                                        href={interview.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Join Meeting
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
