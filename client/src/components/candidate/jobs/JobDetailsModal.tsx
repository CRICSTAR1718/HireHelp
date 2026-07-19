import { useState, useEffect } from "react";
import { MapPin, Clock, Building2, DollarSign, X, ArrowLeft, Zap } from "lucide-react";
import type { Job } from "../../../types/candidate";
import { getJob } from "../../../api/candidate/jobs.api";
import { checkCandidateInTalentPool, applyForJobFromTalentPool } from "../../../api/recruiter/talent-pool.api";
import { useAuth as useCandidateAuth } from "../../../hooks/candidate/useAuth";

interface Props {
    jobId: string;
    onClose: () => void;
    onApply?: (jobId: string) => void;
    onTalentPoolApply?: (jobId: string) => void;
    hasApplied?: boolean;
}

export default function JobDetailsModal({ jobId, onClose, onApply, onTalentPoolApply, hasApplied = false }: Props) {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkingTalentPool, setCheckingTalentPool] = useState(false);
    const [isTalentPoolCandidate, setIsTalentPoolCandidate] = useState(false);
    const [applying, setApplying] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { auth } = useCandidateAuth();

    useEffect(() => {
        let isMounted = true;

        const checkTalentPool = async () => {
            if (!auth.user?.id) {
                return;
            }

            setCheckingTalentPool(true);
            try {
                const inPool = await checkCandidateInTalentPool(auth.user.id);
                if (isMounted) {
                    setIsTalentPoolCandidate(inPool);
                }
            } catch (err) {
                console.error('Failed to check Talent Pool status:', err);
            } finally {
                if (isMounted) {
                    setCheckingTalentPool(false);
                }
            }
        };

        checkTalentPool();

        return () => {
            isMounted = false;
        };
    }, [auth.user?.id]);

    useEffect(() => {
        const fetchJobDetails = async () => {
            console.log('Fetching job details for:', jobId);
            setLoading(true);
            setError(null);
            
            try {
                const jobData = await getJob(jobId);
                console.log('Job details fetched:', jobData);
                setJob(jobData);
            } catch (err) {
                console.error('Failed to fetch job details:', err);
                setError(err instanceof Error ? err.message : 'Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not specified";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleApply = async () => {
        if (!job) {
            return;
        }

        if (isTalentPoolCandidate && auth.user?.id) {
            setApplying(true);
            setError(null);
            setSuccessMessage(null);

            try {
                await applyForJobFromTalentPool(auth.user.id, job.id);
                setSuccessMessage('Application submitted successfully.');
                onTalentPoolApply?.(job.id);
            } catch (err) {
                console.error('Failed to apply from Talent Pool:', err);
                setError(err instanceof Error ? err.message : 'Failed to submit application');
            } finally {
                setApplying(false);
            }

            return;
        }

        onApply?.(job.id);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-8">
                    <div className="text-center text-slate-400">Loading job details...</div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-8">
                    <div className="text-center text-red-400">
                        {error || 'Job not found'}
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={onClose}
                            className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-blue-400 hover:bg-slate-800 hover:text-blue-300 transition-all"
                            title="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white">Job Details</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-blue-400 hover:bg-slate-800 hover:text-blue-300 transition-all"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {successMessage && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                            {successMessage}
                        </div>
                    )}

                    {/* Job Title and Basic Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                            {job.department && (
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} />
                                    {job.department}
                                </div>
                            )}
                            {job.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    {job.location}
                                </div>
                            )}
                            {job.published_at && (
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    Posted {formatDate(job.published_at)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="grid grid-cols-2 gap-4">
                        {job.employment_type && (
                            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                <p className="text-sm text-slate-400">Employment Type</p>
                                <p className="font-semibold text-white">{job.employment_type}</p>
                            </div>
                        )}
                        {job.work_mode && (
                            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                <p className="text-sm text-slate-400">Work Mode</p>
                                <p className="font-semibold text-white">{job.work_mode}</p>
                            </div>
                        )}
                        {job.salary && (
                            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                <p className="text-sm text-slate-400">Salary</p>
                                <p className="font-semibold text-green-400 flex items-center gap-2">
                                    <DollarSign size={16} />
                                    {job.salary}
                                </p>
                            </div>
                        )}
                        {job.number_of_openings && (
                            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                <p className="text-sm text-slate-400">Openings</p>
                                <p className="font-semibold text-white">{job.number_of_openings}</p>
                            </div>
                        )}
                    </div>

                    {/* Job Description */}
                    {job.about_role && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <h4 className="text-md font-semibold text-white mb-2">About the Role</h4>
                            <p className="text-slate-300 whitespace-pre-wrap">{job.about_role}</p>
                        </div>
                    )}

                    {/* Responsibilities */}
                    {job.responsibilities && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <h4 className="text-md font-semibold text-white mb-2">Responsibilities</h4>
                            <p className="text-slate-300 whitespace-pre-wrap">{job.responsibilities}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {job.required_skills && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <h4 className="text-md font-semibold text-white mb-2">Required Skills</h4>
                            <p className="text-slate-300 whitespace-pre-wrap">{job.required_skills}</p>
                        </div>
                    )}

                    {job.preferred_skills && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <h4 className="text-md font-semibold text-white mb-2">Preferred Skills</h4>
                            <p className="text-slate-300 whitespace-pre-wrap">{job.preferred_skills}</p>
                        </div>
                    )}

                    {/* Requirements */}
                    {job.experience_required && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <h4 className="text-md font-semibold text-white mb-2">Experience Required</h4>
                            <p className="text-slate-300">{job.experience_required}</p>
                        </div>
                    )}

                    {job.education_requirements && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <h4 className="text-md font-semibold text-white mb-2">Education Requirements</h4>
                            <p className="text-slate-300 whitespace-pre-wrap">{job.education_requirements}</p>
                        </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <h4 className="text-md font-semibold text-white mb-2">Benefits</h4>
                            <p className="text-slate-300 whitespace-pre-wrap">{job.benefits}</p>
                        </div>
                    )}

                    {/* Deadline */}
                    {job.application_deadline && (
                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                            <p className="text-sm text-slate-400">Application Deadline</p>
                            <p className="font-semibold text-white">{formatDate(job.application_deadline)}</p>
                        </div>
                    )}

                    {/* Apply Button */}
                    {onApply && (
                        <div className="flex gap-3 pt-4 border-t border-slate-800">
                            <button
                                onClick={handleApply}
                                disabled={hasApplied || applying || checkingTalentPool}
                                className={`flex-1 rounded-lg px-6 py-3 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 ${
                                    hasApplied
                                        ? "bg-slate-700 cursor-not-allowed"
                                        : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25 hover:shadow-blue-500/30"
                                }`}
                            >
                                {hasApplied ? "Already Applied" : applying ? "Applying..." : "Apply Now"}
                            </button>
                            <button
                                onClick={onClose}
                                className="rounded-lg border border-slate-700/50 px-6 py-3 text-blue-400 hover:bg-slate-800/50 hover:border-slate-600 hover:text-blue-300 transition-all duration-300"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
