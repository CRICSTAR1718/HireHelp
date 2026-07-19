import { Card } from "../../../components/admin/ui";
import { SectionTitle } from "../../../components/admin/common";
import type { Experience } from "../../../types/candidate";

interface Props {
    experience: Experience[];
}

export default function ExperienceCard({ experience }: Props) {
    const safeExperience = experience ?? [];

    return (
        <Card className="p-5">
            <SectionTitle title="Experience" />
            <div className="mt-4 space-y-4">
                {safeExperience.map((item) => (
                    <div key={item.id}>
                        <h3 className="text-sm font-semibold text-slate-900">
                            {item.role}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {item.company}
                        </p>
                        <p className="text-xs text-slate-500">
                            {item.startDate} - {item.endDate}
                        </p>
                        {item.description && (
                            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}
