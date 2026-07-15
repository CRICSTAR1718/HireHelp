import type { Application } from "../../../types/candidate";

interface Props {
    applications: Application[];
}

export default function RecentApplications({ applications }: Props) {
    return (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Recent Applications</h2>

            {applications.length === 0 ? (
                <p className="text-slate-400">No applications yet.</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((job) => (
                        <div
                            key={job.id}
                            className="flex justify-between items-center border-b border-slate-800 pb-4"
                        >
                            <div>
                                <h3 className="text-white font-semibold">{job.jobTitle || 'Job Position'}</h3>
                                <p className="text-slate-400">{job.company}</p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                    job.status === "interview"
                                        ? "bg-green-600"
                                        : job.status === "applied"
                                        ? "bg-blue-600"
                                        : job.status === "offer"
                                        ? "bg-purple-600"
                                        : "bg-red-600"
                                }`}
                            >
                                {job.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
