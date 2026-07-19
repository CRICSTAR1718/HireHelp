import { Card } from "../../../components/admin/ui";
import { SectionTitle } from "../../../components/admin/common";
import type { Education } from "../../../types/candidate";

interface Props {
    education: Education[];
}

export default function EducationCard({ education }: Props) {
    return (
        <Card className="p-5">
            <SectionTitle title="Education" />
            <div className="mt-4 space-y-4">
                {education.map((item) => (
                    <div key={item.id}>
                        <h3 className="text-sm font-semibold text-slate-900">
                            {item.degree} {item.field}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {item.school}
                        </p>
                        <p className="text-xs text-slate-500">
                            {item.startDate} - {item.endDate}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
