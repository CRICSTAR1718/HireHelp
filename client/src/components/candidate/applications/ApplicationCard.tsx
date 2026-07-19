import { Building2, CalendarDays, MapPin } from "lucide-react";
import { Card, Button } from "../../../components/admin/ui";
import { StatusBadge } from "../../../components/admin/common";

interface Props {
    company: string;
    role: string;
    location: string;
    appliedDate: string;
    status: "Applied" | "Interview" | "Rejected" | "Offer";
    onView?: () => void;
}

function getStatusTone(status: string): "success" | "warning" | "neutral" | "info" {
    switch (status) {
        case "Offer":
            return "success";
        case "Interview":
            return "info";
        case "Rejected":
            return "warning";
        default:
            return "neutral";
    }
}

export default function ApplicationCard({
    company,
    role,
    location,
    appliedDate,
    status,
    onView,
}: Props) {
    return (
        <Card className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900">{role}</h3>

                    <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />
                            {company}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {location}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            Applied {appliedDate}
                        </div>
                    </div>
                </div>

                <StatusBadge label={status} tone={getStatusTone(status)} />
            </div>

            <div className="mt-4">
                {onView && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onView}
                    >
                        View
                    </Button>
                )}
            </div>
        </Card>
    );
}