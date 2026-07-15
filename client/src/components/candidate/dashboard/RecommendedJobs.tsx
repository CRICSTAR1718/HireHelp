interface RecommendedJob {
    id: string;
    title: string;
    company: string;
}

interface Props {
    jobs: RecommendedJob[];
}

export default function RecommendedJobs({ jobs }: Props) {
    const safeJobs = jobs ?? [];

    return (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

            <h2 className="text-xl font-bold text-white mb-6">
                Recommended Jobs
            </h2>

            {safeJobs.length === 0 ? (
                <p className="text-slate-400">No recommendations yet.</p>
            ) : (
                <div className="space-y-5">
                    {safeJobs.map((job) => (
                        <div
                            key={job.id}
                            className="border-b border-slate-800 pb-4"
                        >
                            <h3 className="text-white font-semibold">
                                {job.title}
                            </h3>

                            <p className="text-slate-400">
                                {job.company}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
