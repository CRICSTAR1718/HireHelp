import type { InterviewStats as InterviewStatsType } from "../../../types/candidate";

interface Props {
    stats: InterviewStatsType;
}

export default function InterviewStats({ stats }: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
                Interview Statistics
            </h2>

            <div className="space-y-5">
                <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled</span>
                    <span className="text-white font-semibold">{stats.scheduled}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">Completed</span>
                    <span className="text-white font-semibold">{stats.completed}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">Offers</span>
                    <span className="text-green-400 font-semibold">{stats.offers}</span>
                </div>
            </div>
        </div>
    );
}
