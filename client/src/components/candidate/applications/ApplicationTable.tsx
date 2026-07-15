import ApplicationCard from "./ApplicationCard";
import type { Application } from "../../../types/candidate";

interface Props {
    applications: Application[];
}

function formatDate(date: string) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function ApplicationTable({ applications }: Props) {
    if (applications.length === 0) {
        return (
            <p className="text-slate-400">
                No applications yet. Browse jobs and apply to get started.
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {applications.map((app) => (
                <ApplicationCard
                    key={app.id}
                    company={app.company}
                    role={app.role}
                    location={app.location}
                    appliedDate={formatDate(app.appliedDate)}
                    status={app.status}
                />
            ))}
        </div>
    );
}
