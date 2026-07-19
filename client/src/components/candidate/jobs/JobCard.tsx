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
        <Card className="p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>

                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                        {department && (
                            <div className="flex items-center gap-1.5">
                                <Building2 className="h-4 w-4" />
                                {department}
                            </div>
                        )}
                        {location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {location}
                            </div>
                        )}
                    </div>
                </div>

                {hasApplied && (
                    <StatusBadge label="Applied" tone="success" />
                )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {employment_type && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {employment_type}
                    </span>
                )}
                {work_mode && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {work_mode}
                    </span>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(published_at)}
                </div>

                <div className="flex gap-2">
                    {onViewDetails && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(id)}
                        >
                            View Details
                        </Button>
                    )}
                    {!hasApplied && onApply && (
                        <Button
                            size="sm"
                            onClick={() => onApply(id)}
                            disabled={applying}
                        >
                            {applying ? "Applying..." : "Apply"}
                        </Button>
                    )}
                </div>
            </div>

            {salary && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{salary}</p>
                </div>
            )}
        </Card>
    );
}
