interface Props {
    skills: string[];
}

export default function SkillsCard({ skills }: Props) {
    return (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6 hover:text-blue-400 transition-colors">
                Skills
            </h2>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300 cursor-default"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}
