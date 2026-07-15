import {
    Calendar,
    Clock,
    Video,
    User,
    Building2,
} from "lucide-react";

interface Props {
    company: string;
    role: string;
    interviewer: string;
    date: string;
    time: string;
    meetingLink: string;
    status?: string;
}

export default function InterviewCard({
    company,
    role,
    interviewer,
    date,
    time,
    meetingLink,
    status,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group">
            <div className="flex justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {role}
                    </h2>

                    <div className="mt-3 flex items-center gap-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Building2 size={16} />
                        {company}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <User size={16} />
                        {interviewer}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Calendar size={16} />
                        {date}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Clock size={16} />
                        {time}
                    </div>
                </div>

                {status && (
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                        {status}
                    </span>
                )}
            </div>

            <div className="mt-6">
                <a
                    href={meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25"
                >
                    <Video size={18} />
                    Join Meeting
                </a>
            </div>
        </div>
    );
}
