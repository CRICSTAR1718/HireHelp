import type { NotificationStats as NotificationStatsType } from "../../../types/candidate";

interface Props {
    stats: NotificationStatsType;
    onMarkAllRead?: () => void;
}

export default function NotificationStats({ stats, onMarkAllRead }: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-xl font-semibold text-white">
                Notification Summary
            </h2>

            <div className="space-y-5">
                <div className="flex justify-between">
                    <span className="text-slate-400">Total</span>
                    <span className="font-bold text-white">{stats.total}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">Unread</span>
                    <span className="font-bold text-blue-400">{stats.unread}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">Interviews</span>
                    <span className="font-bold text-green-400">{stats.interviews}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">Applications</span>
                    <span className="font-bold text-yellow-400">{stats.applications}</span>
                </div>
            </div>

            <button
                type="button"
                onClick={onMarkAllRead}
                className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
            >
                Mark All Read
            </button>
        </div>
    );
}
