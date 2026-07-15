import InterviewCard from "./InterviewCard";
import type { Interview } from "../../../types/candidate";

interface Props {
    interviews: Interview[];
}

function formatDate(date: string) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return parsed.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function InterviewList({ interviews }: Props) {
    if (interviews.length === 0) {
        return <p className="text-slate-400">No interviews scheduled yet.</p>;
    }

    return (
        <div className="space-y-6">
            {interviews.map((item) => (
                <InterviewCard
                    key={item.id}
                    company={item.company}
                    role={item.role}
                    interviewer={item.interviewer}
                    date={formatDate(item.date)}
                    time={item.time}
                    meetingLink={item.meetingLink}
                    status={item.status}
                />
            ))}
        </div>
    );
}
