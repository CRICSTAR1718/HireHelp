import { useState, useEffect } from "react";
import ApplicationCard from "./ApplicationCard";
import type { Application, Job } from "../../../types/candidate";
import { getJob } from "../../../api/candidate/jobs.api";

interface Props {
    applications: Application[];
}

function formatDate(date: string) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'submitted': 'Applied',
        'under_review': 'Under Review',
        'shortlisted': 'Shortlisted',
        'rejected': 'Rejected',
        'hired': 'Hired',
        'interview': 'Interview',
        'offer': 'Offer',
        'applied': 'Applied'
    };
    return statusMap[status] || status;
}

export default function ApplicationTable({ applications }: Props) {
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [jobDetails, setJobDetails] = useState<Job | null>(null);
    const [loadingJob, setLoadingJob] = useState(false);

    const getApplicationTitle = (application: Application) =>
        application.jobTitle || application.job_title || jobDetails?.title || "Job Position";

    const handleView = async (application: Application) => {
        console.log('View button clicked for application:', application);
        setSelectedApplication(application);
        
        // Fetch job details
        if (application.jobId) {
            setLoadingJob(true);
            try {
                const job = await getJob(application.jobId);
                setJobDetails(job);
            } catch (error) {
                console.error('Failed to fetch job details:', error);
            } finally {
                setLoadingJob(false);
            }
        }
    };


    const handleCloseModal = () => {
        setSelectedApplication(null);
        setJobDetails(null);
    };

    if (applications.length === 0) {
        return (
            <p className="text-slate-400">
                No applications yet. Browse jobs and apply to get started.
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {applications.map((app) => (
                <ApplicationCard
                    key={app.id}
                    company={app.company || app.department || "Company"}
                    role={app.jobTitle || app.job_title || "Job Position"}
                    location={app.location || "Location"}
                    appliedDate={formatDate(app.appliedDate)}
                    status={formatStatus(app.status) as any}
                    onView={() => handleView(app)}
                />
            ))}

            {/* Application Details Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm p-6">
                            <h2 className="text-xl font-bold text-white">Application Details</h2>
                            <button
                                onClick={handleCloseModal}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Job Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {getApplicationTitle(selectedApplication)}
                                </h3>
                                <p className="text-slate-400">
                                    {selectedApplication.company || selectedApplication.department || "Company"}
                                </p>
                                <p className="text-slate-400">
                                    {selectedApplication.location || "Location"}
                                </p>
                            </div>

                            {/* Status Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                    <p className="text-sm text-slate-400">Status</p>
                                    <p className="font-semibold text-white">
                                        {formatStatus(selectedApplication.status)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                    <p className="text-sm text-slate-400">Applied Date</p>
                                    <p className="font-semibold text-white">
                                        {formatDate(selectedApplication.appliedDate)}
                                    </p>
                                </div>
                            </div>

                            {/* Application ID */}
                            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                <p className="text-sm text-slate-400 mb-2">Application ID</p>
                                <p className="font-mono text-sm text-slate-300">
                                    {selectedApplication.id}
                                </p>
                            </div>

                            {/* Job Description */}
                            {loadingJob ? (
                                <div className="text-slate-400">Loading job details...</div>
                            ) : jobDetails ? (
                                <div className="space-y-4">
                                    <h4 className="text-md font-semibold text-white">Job Description</h4>
                                    
                                    {jobDetails.about_role && (
                                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                            <p className="text-sm text-slate-400 mb-2">About the Role</p>
                                            <p className="text-slate-300 whitespace-pre-wrap">{jobDetails.about_role}</p>
                                        </div>
                                    )}

                                    {jobDetails.responsibilities && (
                                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                            <p className="text-sm text-slate-400 mb-2">Responsibilities</p>
                                            <p className="text-slate-300 whitespace-pre-wrap">{jobDetails.responsibilities}</p>
                                        </div>
                                    )}

                                    {jobDetails.required_skills && (
                                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                            <p className="text-sm text-slate-400 mb-2">Required Skills</p>
                                            <p className="text-slate-300 whitespace-pre-wrap">{jobDetails.required_skills}</p>
                                        </div>
                                    )}

                                    {jobDetails.experience_required && (
                                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                            <p className="text-sm text-slate-400 mb-2">Experience Required</p>
                                            <p className="text-slate-300">{jobDetails.experience_required}</p>
                                        </div>
                                    )}

                                    {jobDetails.education_requirements && (
                                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                            <p className="text-sm text-slate-400 mb-2">Education Requirements</p>
                                            <p className="text-slate-300 whitespace-pre-wrap">{jobDetails.education_requirements}</p>
                                        </div>
                                    )}

                                    {jobDetails.salary && (
                                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                            <p className="text-sm text-slate-400 mb-2">Salary</p>
                                            <p className="text-slate-300">{jobDetails.salary}</p>
                                        </div>
                                    )}

                                    {jobDetails.benefits && (
                                        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                            <p className="text-sm text-slate-400 mb-2">Benefits</p>
                                            <p className="text-slate-300 whitespace-pre-wrap">{jobDetails.benefits}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-slate-400">Job details not available</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
