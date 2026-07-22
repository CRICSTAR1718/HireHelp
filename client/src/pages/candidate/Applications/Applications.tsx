import { useEffect, useState } from "react";
import { SectionTitle, LoadingState } from "../../../components/admin/common";
import ApplicationTable from "../../../components/candidate/applications/ApplicationTable";
import { getApplications } from "../../../api/candidate/applications.api";
import { toUserMessage } from "../../../utils/toUserMessage";
import type { Application } from "../../../types/candidate";

export default function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getApplications()
            .then(setApplications)
            .catch((err) =>
                setError(toUserMessage(err, "Failed to load applications. Please try again."))
            )
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <SectionTitle
                description="Track all your job applications."
                title="Applications"
            />

            {loading ? (
                <LoadingState />
            ) : error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                    {error}
                </div>
            ) : (
                <ApplicationTable applications={applications} />
            )}
        </div>
    );
}
