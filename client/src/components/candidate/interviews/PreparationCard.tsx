import { CheckCircle2 } from "lucide-react";

const checklist = [
    "Research company",
    "Review resume",
    "Practice DSA",
    "Check microphone",
    "Prepare questions",
];

export default function PreparationCard() {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold text-white mb-6">
                Interview Preparation
            </h2>

            <div className="space-y-4">

                {checklist.map((item) => (

                    <div
                        key={item}
                        className="flex items-center gap-3"
                    >
                        <CheckCircle2 className="text-green-500" />

                        <span className="text-slate-300">
                            {item}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}