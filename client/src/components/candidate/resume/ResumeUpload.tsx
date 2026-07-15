import { Upload } from "lucide-react";

interface Props {
    onUpload: (file: File) => void;
    uploading?: boolean;
}

export default function ResumeUpload({ onUpload, uploading = false }: Props) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
                Upload Resume
            </h2>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 p-12 hover:border-blue-500">
                <Upload className="mb-4 text-blue-500" size={40} />

                <p className="text-white font-medium">
                    {uploading ? "Uploading..." : "Click to upload your resume"}
                </p>

                <p className="text-slate-400 text-sm mt-2">
                    PDF, DOC, DOCX
                </p>

                <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    disabled={uploading}
                />
            </label>
        </div>
    );
}
