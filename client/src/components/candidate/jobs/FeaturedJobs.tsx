import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import JobCard from "./JobCard";
import Loader from "../ui/Loader";
import { getJobs } from "../../../api/candidate/jobs.api";
import { applyToJob } from "../../../api/candidate/applications.api";
import type { Job } from "../../../types/candidate";

export default function FeaturedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
            getJobs(search || undefined)
                .then(setJobs)
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    async function handleApply(jobId: string) {
        setApplyingId(jobId);
        setMessage(null);

        try {
            await applyToJob(jobId);
            setMessage("Application submitted successfully!");
        } catch (error) {
            setMessage(
                error instanceof Error ? error.message : "Failed to apply"
            );
        } finally {
            setApplyingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/50 p-5">
                <div className="flex items-center gap-3">
                    <Search className="text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                    />
                </div>
            </div>

            {message && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-200">
                    {message}
                </div>
            )}

            {loading ? (
                <Loader />
            ) : jobs.length === 0 ? (
                <p className="text-slate-400">No jobs found.</p>
            ) : (
                jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        id={job.id}
                        company={job.company}
                        role={job.role}
                        location={job.location}
                        type={job.type}
                        onApply={handleApply}
                        applying={applyingId === job.id}
                    />
                ))
            )}
        </div>
    );
}
