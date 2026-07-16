import { Building2, CalendarDays, MapPin } from "lucide-react";
import ApplicationStatus from "./ApplicationStatus";

interface Props {
    company: string;
    role: string;
    location: string;
    appliedDate: string;
    status: "Applied" | "Interview" | "Rejected" | "Offer";
    onView?: () => void;
    onWithdraw?: () => void;
}

export default function ApplicationCard({
    company,
    role,
    location,
    appliedDate,
    status,
    onView,
    onWithdraw,
}: Props) {
    return (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group">

            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {role}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Building2 size={16} className="group-hover:scale-110 transition-transform" />
                        {company}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <MapPin size={16} className="group-hover:scale-110 transition-transform" />
                        {location}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <CalendarDays size={16} className="group-hover:scale-110 transition-transform" />
                        Applied {appliedDate}
                    </div>
                </div>

                <ApplicationStatus status={status} />
            </div>

            <div className="mt-6 flex gap-3">

                <button 
                    onClick={() => {
                        console.log('View button clicked directly in ApplicationCard');
                        if (onView) onView();
                    }}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
                >
                    View
                </button>

                <button 
                    onClick={() => {
                        console.log('Withdraw button clicked directly in ApplicationCard');
                        if (onWithdraw) onWithdraw();
                    }}
                    className="rounded-lg border border-blue-500/50 bg-blue-600/10 px-4 py-2 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500 transition-all duration-300"
                >
                    Withdraw
                </button>

            </div>

        </div>
    );
}