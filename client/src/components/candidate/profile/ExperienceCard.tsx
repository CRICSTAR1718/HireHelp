import type { Experience } from "../../../types/candidate";

interface Props {
    experience: Experience[];
}

export default function ExperienceCard({ experience }: Props) {
    const safeExperience = experience ?? [];

    return (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">

            <h2 className="text-xl font-semibold text-white mb-6 hover:text-blue-400 transition-colors">
                Experience
            </h2>

            <div className="space-y-6">
                {safeExperience.map((item) => (
                    <div key={item.id} className="group">
                        <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                            {item.role}
                        </h3>

                        <p className="text-slate-400 group-hover:text-blue-400 transition-colors">
                            {item.company}
                        </p>

                        <p className="text-slate-500 group-hover:text-blue-500 transition-colors">
                            {item.startDate} - {item.endDate}
                        </p>

                        {item.description && (
                            <p className="mt-2 text-slate-400">{item.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
