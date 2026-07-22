import { Card } from "../../../components/admin/ui";
import { SectionTitle } from "../../../components/admin/common";

interface Props {
    skills: string[];
}

export default function SkillsCard({ skills }: Props) {
    return (
        <Card className="p-5 hh-lift">
            <SectionTitle title="Skills" />
            <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </Card>
    );
}
