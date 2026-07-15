import { useEffect, useState } from "react";

import PageTitle from "../../../components/candidate/ui/PageTitle";
import ApplicationTable from "../../../components/candidate/applications/ApplicationTable";
import Loader from "../../../components/candidate/ui/Loader";
import { getApplications } from "../../../api/candidate/applications.api";
import type { Application } from "../../../types/candidate";

export default function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getApplications()
            .then(setApplications)
            .catch((err) =>
                setError(err instanceof Error ? err.message : "Failed to load applications")
            )
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <PageTitle
                title="Applications"
                subtitle="Track all your job applications."
            />

            {loading ? (
                <Loader />
            ) : error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
                    {error}
                </div>
            ) : (
                <ApplicationTable applications={applications} />
            )}
        </div>
    );
}
