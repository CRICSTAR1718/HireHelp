import { useEffect, useState } from "react";

import PageTitle from "../../../components/candidate/ui/PageTitle";
import ResumeUpload from "../../../components/candidate/resume/ResumeUpload";
import ResumePreview from "../../../components/candidate/resume/ResumePreview";
import ResumeScore from "../../../components/candidate/resume/ResumeScore";
import ResumeAnalytics from "../../../components/candidate/resume/ResumeAnalytics";
import Loader from "../../../components/candidate/ui/Loader";
import {
    getResume,
    getResumeAnalytics,
    uploadResume,
} from "../../../api/candidate/resume.api";
import type { Resume, ResumeAnalytics as ResumeAnalyticsType } from "../../../types/candidate";

export default function ResumePage() {
    const [resume, setResume] = useState<Resume | null>(null);
    const [analytics, setAnalytics] = useState<ResumeAnalyticsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        Promise.resolve()
            .then(() => {
                if (cancelled) return;
                setLoading(true);
            })
            .then(() => Promise.all([getResume(), getResumeAnalytics()]))
            .then(([resumeData, analyticsData]) => {
                if (cancelled) return;
                setResume(resumeData);
                setAnalytics(analyticsData);
                setError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setResume(null);
                setAnalytics(null);
                setError(err instanceof Error ? err.message : "Failed to load resume");
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [refreshKey]);

    async function handleUpload(fileName: string) {
        setUploading(true);
        try {
            await uploadResume(fileName);
            setError(null);
            setRefreshKey((k) => k + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload resume");
        } finally {
            setUploading(false);
        }
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="space-y-8">
            <PageTitle
                title="Resume"
                subtitle="Manage your professional resume."
            />

            {error && !resume && (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-slate-300">
                    {error}. Upload a resume to get started.
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6">
                    <ResumeUpload onUpload={handleUpload} uploading={uploading} />
                    <ResumeScore score={resume?.score ?? analytics?.score ?? 0} />
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <ResumePreview resume={resume} />
                    <ResumeAnalytics analytics={analytics} />
                </div>
            </div>
        </div>
    );
}