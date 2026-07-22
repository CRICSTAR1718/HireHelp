import { MapPin, Clock, Building2 } from "lucide-react";
import { Card } from "../../../components/admin/ui";
import { Button } from "../../../components/admin/ui";
import { StatusBadge } from "../../../components/admin/common";

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
    onViewDetails?: (jobId: string) => void;
    applying?: boolean;
    hasApplied?: boolean;
    className?: string;
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
    onViewDetails,
    applying = false,
    hasApplied = false,
    className = "",
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
        <Card className={`p-6 sm:p-8 hover:shadow-md transition-shadow hh-lift ${className}`}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-5">
                <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">{title}</h3>

                    <div className="mt-4 flex flex-wrap gap-4 text-base sm:text-lg text-slate-500">
                        {department && (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                {department}
                            </div>
                        )}
                        {location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                                {location}
                            </div>
                        )}
                    </div>
                </div>

                {hasApplied && (
                    <StatusBadge label="Applied" tone="success" />
                )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                {employment_type && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 sm:px-5 sm:py-2 text-base font-medium text-slate-600">
                        {employment_type}
                    </span>
                )}
                {work_mode && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 sm:px-5 sm:py-2 text-base font-medium text-slate-600">
                        {work_mode}
                    </span>
                )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-base text-slate-400">
                    <Clock className="h-5 w-5" />
                    {formatDate(published_at)}
                </div>

                <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {onViewDetails && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(id)}
                            className="text-sm sm:text-base whitespace-nowrap"
                        >
                            View Details
                        </Button>
                    )}
                    {!hasApplied && onApply && (
                        <Button
                            size="sm"
                            onClick={() => onApply(id)}
                            disabled={applying}
                            className="text-sm sm:text-base whitespace-nowrap"
                        >
                            {applying ? "Applying..." : "Apply"}
                        </Button>
                    )}
                </div>
            </div>

            {salary && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                    <p className="text-lg font-medium text-slate-900">{salary}</p>
                </div>
            )}
        </Card>
    );
}
