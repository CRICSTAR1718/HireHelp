import { useEffect, useState } from "react";

import JobCard from "./JobCard";
import ApplicationForm from "./ApplicationForm";
import JobDetailsModal from "./JobDetailsModal";
import Loader from "../ui/Loader";
import { getJobs, getJobForm } from "../../../api/candidate/jobs.api";
import { submitApplication, checkApplicationStatus } from "../../../api/candidate/applications.api";
import { uploadResume } from "../../../api/candidate/profile.api";
import { toUserMessage } from "../../../utils/toUserMessage";
import type { Job, FormResponse } from "../../../types/candidate";

interface FeaturedJobsProps {
    initialSelectedJobId?: string | null;
}

export default function FeaturedJobs({ initialSelectedJobId = null }: FeaturedJobsProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
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

    // Job Details Modal state
    const [selectedJobForDetails, setSelectedJobForDetails] = useState<string | null>(initialSelectedJobId);

    useEffect(() => {
        if (initialSelectedJobId) {
            setSelectedJobForDetails(initialSelectedJobId);
        }
    }, [initialSelectedJobId]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getJobs()
            .then(setJobs)
            .catch((err) => {
                setError(toUserMessage(err, "Failed to load jobs. Please try again."));
                setJobs([]);
            })
            .finally(() => setLoading(false));
    }, []);

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
            setFormError(toUserMessage(err, "Failed to load application form. Please try again."));
        } finally {
            setLoadingForm(false);
        }
    }

    async function handleFormSubmit(responses: FormResponse[], resumeFile?: File) {
        if (!selectedJobId) return;

        setSubmitting(true);
        setFormError(null);

        try {
            // Resume is mandatory
            if (!resumeFile) {
                setFormError('Resume is required for application submission');
                setSubmitting(false);
                return;
            }

            // Upload resume
            let resumeId: number;
            try {
                const uploadResult = await uploadResume(resumeFile);
                resumeId = uploadResult.id;
                console.log('Resume uploaded successfully:', uploadResult);
            } catch (uploadError) {
                console.error('Resume upload failed:', uploadError);
                setFormError('Failed to upload resume. Please try again.');
                setSubmitting(false);
                return;
            }

            await submitApplication({
                jobId: selectedJobId,
                responses,
                resumeId
            });

            setSuccessMessage("Application submitted successfully!");
            setAppliedJobIds(prev => new Set([...prev, selectedJobId]));
            setSelectedJobId(null);
            setFormFields(null);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setFormError(toUserMessage(err, "Failed to submit application. Please try again."));
        } finally {
            setSubmitting(false);
        }
    }

    function handleFormCancel() {
        setSelectedJobId(null);
        setFormFields(null);
        setFormError(null);
    }

    function handleViewDetails(jobId: string) {
        console.log('View Details requested for job:', jobId);
        setSelectedJobForDetails(jobId);
    }

    function handleCloseDetails() {
        setSelectedJobForDetails(null);
    }

    function handleApplyFromDetails(jobId: string) {
        setSelectedJobForDetails(null);
        handleApply(jobId);
    }

    function handleTalentPoolApply(jobId: string) {
        setAppliedJobIds(prev => new Set([...prev, jobId]));
    }

    return (
        <div className="space-y-6">
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
                <p className="text-slate-500">No jobs found.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 hh-stagger">
                    {jobs.map((job) => (
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
                            onViewDetails={handleViewDetails}
                            hasApplied={appliedJobIds.has(job.id)}
                            className="hh-stagger-item"
                        />
                    ))}
                </div>
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

            {/* Job Details Modal */}
            {selectedJobForDetails && (
                <JobDetailsModal
                    jobId={selectedJobForDetails}
                    onClose={handleCloseDetails}
                    onApply={handleApplyFromDetails}
                    onTalentPoolApply={handleTalentPoolApply}
                    hasApplied={appliedJobIds.has(selectedJobForDetails)}
                />
            )}
        </div>
    );
}
