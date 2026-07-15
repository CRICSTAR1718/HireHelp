import { FileText } from "lucide-react";
import type { Resume } from "../../../types/candidate";

interface Props {
    resume: Resume | null;
}

export default function ResumePreview({ resume }: Props) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
                Resume Preview
            </h2>

            <div className="flex h-80 items-center justify-center rounded-xl bg-slate-800">
                {resume ? (
                    <div className="text-center">
                        <FileText size={70} className="mx-auto text-blue-500" />

                        <p className="mt-4 text-white">{resume.fileName}</p>

                        <p className="mt-2 text-slate-400">
                            Uploaded{" "}
                            {new Date(resume.uploadedAt).toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-slate-400">No resume uploaded yet.</p>
                )}
            </div>
        </div>
    );
}
