import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import JobCard from "./JobCard";
import ApplicationForm from "./ApplicationForm";
import Loader from "../ui/Loader";
import { getJobs, getJobForm } from "../../../api/candidate/jobs.api";
import { submitApplication, checkApplicationStatus } from "../../../api/candidate/applications.api";
import type { Job, FormResponse } from "../../../types/candidate";

export default function FeaturedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
    
    // Form state
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [formFields, setFormFields] = useState<any[] | null>(null);
    const [loadingForm, setLoadingForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
            setError(null);
            getJobs(search || undefined)
                .then(setJobs)
                .catch((err) => {
                    setError(err instanceof Error ? err.message : "Failed to load jobs");
                    setJobs([]);
                })
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    // Check application status for all jobs on load
    useEffect(() => {
        if (jobs.length > 0) {
            jobs.forEach(job => {
                checkApplicationStatus(job.id)
                    .then(result => {
                        if (result.applied) {
                            setAppliedJobIds(prev => new Set([...prev, job.id]));
                        }
                    })
                    .catch(() => {
                        // Ignore errors for individual checks
                    });
            });
        }
    }, [jobs]);

    async function handleApply(jobId: string) {
        setSelectedJobId(jobId);
        setFormFields(null);
        setFormError(null);
        setLoadingForm(true);

        try {
            const form = await getJobForm(jobId);
            setFormFields(form.fields);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to load application form");
        } finally {
            setLoadingForm(false);
        }
    }

    async function handleFormSubmit(responses: FormResponse[], resumeId?: number) {
        if (!selectedJobId) return;

        setSubmitting(true);
        setFormError(null);

        try {
            await submitApplication({
                jobId: selectedJobId,
                resumeId,
                responses
            });

            setSuccessMessage("Application submitted successfully!");
            setAppliedJobIds(prev => new Set([...prev, selectedJobId]));
            setSelectedJobId(null);
            setFormFields(null);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    }

    function handleFormCancel() {
        setSelectedJobId(null);
        setFormFields(null);
        setFormError(null);
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

            {successMessage && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {error}
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
                        title={job.title}
                        department={job.department}
                        location={job.location}
                        employment_type={job.employment_type}
                        work_mode={job.work_mode}
                        salary={job.salary}
                        published_at={job.published_at}
                        onApply={handleApply}
                        hasApplied={appliedJobIds.has(job.id)}
                    />
                ))
            )}

            {/* Application Form Modal */}
            {selectedJobId && formFields && (
                <ApplicationForm
                    fields={formFields}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    submitting={submitting}
                />
            )}

            {/* Loading Form */}
            {selectedJobId && loadingForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Loader />
                </div>
            )}

            {/* Form Error */}
            {selectedJobId && formError && !loadingForm && !formFields && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Error</h3>
                        <p className="text-rose-400 mb-4">{formError}</p>
                        <button
                            onClick={handleFormCancel}
                            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
