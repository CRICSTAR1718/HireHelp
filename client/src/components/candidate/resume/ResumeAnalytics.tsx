import type { ResumeAnalytics as ResumeAnalyticsType } from "../../../types/candidate";

interface Props {
    analytics: ResumeAnalyticsType | null;
}

export default function ResumeAnalytics({ analytics }: Props) {
    if (!analytics) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                    Resume Analytics
                </h2>
                <p className="text-slate-400">
                    Upload a resume to see analytics and suggestions.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
                Resume Analytics
            </h2>

            <div className="space-y-5">
                <div className="flex justify-between">
                    <span className="text-slate-400">Keywords Matched</span>
                    <span className="text-white font-semibold">
                        {analytics.keywordsMatched}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-400">Keywords Missing</span>
                    <span className="text-white font-semibold">
                        {analytics.keywordsMissing}
                    </span>
                </div>

                {analytics.sections.map((section) => (
                    <div key={section.name} className="flex justify-between">
                        <span className="text-slate-400">{section.name}</span>
                        <span className="text-green-400 font-semibold">
                            {section.score}%
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="text-white font-semibold mb-3">Suggestions</h3>
                <ul className="space-y-2 text-slate-400">
                    {analytics.suggestions.map((suggestion) => (
                        <li key={suggestion}>• {suggestion}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
