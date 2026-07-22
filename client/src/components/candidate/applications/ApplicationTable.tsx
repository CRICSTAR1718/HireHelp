import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
        <div className="space-y-6 hh-stagger">
            {applications.map((app) => (
                <ApplicationCard
                    key={app.id}
                    company={app.company || app.department || "Company"}
                    role={app.jobTitle || app.job_title || "Job Position"}
                    location={app.location || "Location"}
                    appliedDate={formatDate(app.appliedDate)}
                    status={formatStatus(app.status) as any}
                    onView={() => handleView(app)}
                    className="hh-stagger-item"
                />
            ))}

            {/* Application Details Modal */}
            {selectedApplication && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleCloseModal}>
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm p-6">
                            <h2 className="text-xl font-bold text-slate-900">Application Details</h2>
                            <button
                                onClick={handleCloseModal}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Job Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {getApplicationTitle(selectedApplication)}
                                </h3>
                                <p className="text-slate-600">
                                    {selectedApplication.company || selectedApplication.department || "Company"}
                                </p>
                                <p className="text-slate-600">
                                    {selectedApplication.location || "Location"}
                                </p>
                            </div>

                            {/* Status Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-600">Status</p>
                                    <p className="font-semibold text-slate-900">
                                        {formatStatus(selectedApplication.status)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-600">Applied Date</p>
                                    <p className="font-semibold text-slate-900">
                                        {formatDate(selectedApplication.appliedDate)}
                                    </p>
                                </div>
                            </div>

                            {/* Application ID */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-600 mb-2">Application ID</p>
                                <p className="font-mono text-sm text-slate-700">
                                    {selectedApplication.id}
                                </p>
                            </div>

                            {/* Job Description */}
                            {loadingJob ? (
                                <div className="space-y-3">
                                    <div className="h-4 rounded hh-skeleton" style={{ width: '60%' }} />
                                    <div className="h-4 rounded hh-skeleton" style={{ width: '90%' }} />
                                    <div className="h-4 rounded hh-skeleton" style={{ width: '80%' }} />
                                </div>
                            ) : jobDetails ? (
                                <div className="space-y-4">
                                    <h4 className="text-md font-semibold text-slate-900">Job Description</h4>

                                    {jobDetails.about_role && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600 mb-2">About the Role</p>
                                            <p className="text-slate-700 whitespace-pre-wrap">{jobDetails.about_role}</p>
                                        </div>
                                    )}

                                    {jobDetails.responsibilities && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600 mb-2">Responsibilities</p>
                                            <p className="text-slate-700 whitespace-pre-wrap">{jobDetails.responsibilities}</p>
                                        </div>
                                    )}

                                    {jobDetails.required_skills && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600 mb-2">Required Skills</p>
                                            <p className="text-slate-700 whitespace-pre-wrap">{jobDetails.required_skills}</p>
                                        </div>
                                    )}

                                    {jobDetails.experience_required && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600 mb-2">Experience Required</p>
                                            <p className="text-slate-700">{jobDetails.experience_required}</p>
                                        </div>
                                    )}

                                    {jobDetails.education_requirements && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600 mb-2">Education Requirements</p>
                                            <p className="text-slate-700 whitespace-pre-wrap">{jobDetails.education_requirements}</p>
                                        </div>
                                    )}

                                    {jobDetails.salary && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600 mb-2">Salary</p>
                                            <p className="text-slate-700">{jobDetails.salary}</p>
                                        </div>
                                    )}

                                    {jobDetails.benefits && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-sm text-slate-600 mb-2">Benefits</p>
                                            <p className="text-slate-700 whitespace-pre-wrap">{jobDetails.benefits}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-slate-600">Job details not available</div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
