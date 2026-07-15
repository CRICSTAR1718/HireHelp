import { MapPin, Clock } from "lucide-react";

interface Props {
    id: string;
    company: string;
    role: string;
    location: string;
    type: string;
    onApply?: (jobId: string) => void;
    applying?: boolean;
}

export default function JobCard({
    id,
    company,
    role,
    location,
    type,
    onApply,
    applying = false,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {role}
                    </h2>

                    <p className="text-slate-400">
                        {company}
                    </p>
                </div>

                <span className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-1 text-sm text-white shadow-lg shadow-blue-500/25">
                    {type}
                </span>
            </div>

            <div className="mt-6 flex gap-6 text-slate-400">
                <div className="flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <MapPin size={16} />
                    {location}
                </div>

                <div className="flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <Clock size={16} />
                    Posted recently
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={() => onApply?.(id)}
                    disabled={applying}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-50"
                >
                    {applying ? "Applying..." : "Apply"}
                </button>

                <button
                    type="button"
                    className="rounded-lg border border-slate-700/50 px-5 py-2 text-white hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
