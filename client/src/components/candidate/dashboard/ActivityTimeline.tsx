interface Props {
    activities: string[];
}

export default function ActivityTimeline({ activities }: Props) {
    const safeActivities = activities ?? [];

    return (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

            <h2 className="text-xl font-bold text-white mb-6">
                Activity Timeline
            </h2>

            <div className="space-y-5">
                {safeActivities.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4"
                    >
                        <div className="h-3 w-3 rounded-full bg-blue-500" />

                        <span className="text-slate-300">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
