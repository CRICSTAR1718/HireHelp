import { useState } from "react";
import ApplicationCard from "./ApplicationCard";
import type { Application } from "../../../types/candidate";

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

    const handleView = (application: Application) => {
        console.log('View button clicked for application:', application);
        setSelectedApplication(application);
    };

    const handleWithdraw = (application: Application) => {
        // TODO: Implement withdraw functionality
        console.log('Withdraw button clicked for application:', application.id);
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
                    role={app.jobTitle || "Role"}
                    location={app.location || "Location"}
                    appliedDate={formatDate(app.appliedDate)}
                    status={formatStatus(app.status) as any}
                    onView={() => handleView(app)}
                    onWithdraw={() => handleWithdraw(app)}
                />
            ))}

            {/* Application Details Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm p-6">
                            <h2 className="text-xl font-bold text-white">Application Details</h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {selectedApplication.jobTitle || "Role"}
                                </h3>
                                <p className="text-slate-400">
                                    {selectedApplication.company || selectedApplication.department || "Company"}
                                </p>
                                <p className="text-slate-400">
                                    {selectedApplication.location || "Location"}
                                </p>
                            </div>
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
                            <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                                <p className="text-sm text-slate-400 mb-2">Application ID</p>
                                <p className="font-mono text-sm text-slate-300">
                                    {selectedApplication.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
