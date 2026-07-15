import { MapPin, Clock, Building2 } from "lucide-react";

interface Props {
    id: string;
    title: string;
    department?: string;
    location?: string;
    employment_type?: string;
    work_mode?: string;
    salary?: string;
    published_at?: string;
    onApply?: (jobId: string) => void;
    applying?: boolean;
    hasApplied?: boolean;
}

export default function JobCard({
    id,
    title,
    department,
    location,
    employment_type,
    work_mode,
    salary,
    published_at,
    onApply,
    applying = false,
    hasApplied = false,
}: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Posted recently";
        const date = new Date(dateString);
        const now = new Date();
        const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo === 0) return "Posted today";
        if (daysAgo === 1) return "Posted yesterday";
        if (daysAgo < 7) return `Posted ${daysAgo} days ago`;
        return `Posted ${date.toLocaleDateString()}`;
    };

    return (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {title}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-3 text-slate-400 text-sm">
                        {department && (
                            <div className="flex items-center gap-2">
                                <Building2 size={14} />
                                {department}
                            </div>
                        )}
                        {location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                {location}
                            </div>
                        )}
                        {employment_type && (
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                                {employment_type}
                            </span>
                        )}
                        {work_mode && (
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                                {work_mode}
                            </span>
                        )}
                    </div>
                </div>

                {salary && (
                    <div className="ml-4 text-right">
                        <p className="text-sm text-slate-400">Salary</p>
                        <p className="text-lg font-semibold text-green-400">{salary}</p>
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                <Clock size={14} />
                {formatDate(published_at)}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={() => onApply?.(id)}
                    disabled={applying || hasApplied}
                    className={`rounded-lg px-5 py-2 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 ${
                        hasApplied
                            ? "bg-slate-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25 hover:shadow-blue-500/30"
                    }`}
                >
                    {hasApplied ? "Already Applied" : applying ? "Applying..." : "Apply"}
                </button>

                <button
                    type="button"
                    className="rounded-lg border border-slate-700/50 px-5 py-2 text-white hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
