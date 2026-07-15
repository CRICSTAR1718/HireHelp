import {
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    UserCircle,
} from "lucide-react";

interface Props {
    title: string;
    message: string;
    time: string;
    type: "job" | "interview" | "profile";
    unread: boolean;
}

export default function NotificationCard({
    title,
    message,
    time,
    type,
    unread,
}: Props) {
    const icon =
        type === "job" ? (
            <BriefcaseBusiness size={20} />
        ) : type === "interview" ? (
            <CalendarDays size={20} />
        ) : (
            <UserCircle size={20} />
        );

    return (
        <div
            className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] group ${unread
                    ? "border-blue-500/50 bg-slate-900/50 shadow-lg shadow-blue-500/20"
                    : "border-slate-800/50 bg-slate-900/50 hover:border-blue-500/50"
                }`}
        >
            <div className="flex justify-between items-start">

                <div className="flex gap-4">

                    <div className="text-blue-500 group-hover:scale-110 transition-transform">
                        {icon}
                    </div>

                    <div>

                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {title}
                        </h3>

                        <p className="mt-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                            {message}
                        </p>

                        <p className="mt-3 text-sm text-slate-500 group-hover:text-blue-500 transition-colors">
                            {time}
                        </p>

                    </div>

                </div>

                {unread && (
                    <Bell size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                )}

            </div>

            <div className="mt-5 flex gap-3">

                <button className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105">
                    Mark Read
                </button>

                <button className="rounded-lg border border-slate-700/50 px-4 py-2 text-white hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300">
                    Delete
                </button>

            </div>
        </div>
    );
}