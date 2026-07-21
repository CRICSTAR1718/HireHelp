import { useEffect, useState } from "react";

import PageTitle from "../ui/PageTitle";
import ApplicationTable from "./ApplicationTable";
import Loader from "../ui/Loader";
import { getApplications } from "@/api/candidate/applications.api";
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