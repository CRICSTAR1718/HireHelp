import type { Interview } from "../../../types/candidate";

interface Props {
    interviews: Interview[];
}

export default function InterviewTimeline({ interviews }: Props) {
    const events = interviews.map(
        (interview) => `${interview.status}: ${interview.role} at ${interview.company}`
    );

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
                Interview Timeline
            </h2>

            {events.length === 0 ? (
                <p className="text-slate-400">No interview activity yet.</p>
            ) : (
                <div className="space-y-5">
                    {events.map((event, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="h-3 w-3 rounded-full bg-blue-500 mt-2" />
                            <p className="text-slate-300">{event}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
