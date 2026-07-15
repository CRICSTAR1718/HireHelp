import { useState, useEffect } from "react";
import { X, Upload, FileText, Check } from "lucide-react";
import type { FormField, FieldOption, FormResponse } from "../../../types/candidate";
import { getResume, uploadResume } from "../../../api/candidate/resume.api";
import type { Resume } from "../../../types/candidate";

interface Props {
    fields: FormField[];
    onSubmit: (responses: FormResponse[], resumeId?: number) => void;
    onCancel: () => void;
    submitting?: boolean;
}

interface FieldValue {
    field_id: string;
    value: string | string[] | File | boolean | number | null;
}

export default function ApplicationForm({ fields, onSubmit, onCancel, submitting = false }: Props) {
    const [values, setValues] = useState<FieldValue[]>(
        fields.map(field => ({ field_id: field.id, value: null }))
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Resume state
    const [resume, setResume] = useState<Resume | null>(null);
    const [loadingResume, setLoadingResume] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [resumeError, setResumeError] = useState<string | null>(null);

    // Load existing resume on mount
    useEffect(() => {
        setLoadingResume(true);
        getResume()
            .then(setResume)
            .catch(() => {
                // No resume uploaded yet, that's fine
                setResume(null);
            })
            .finally(() => setLoadingResume(false));
    }, []);

    const updateValue = (fieldId: string, value: string | string[] | File | boolean | number | null) => {
        setValues(prev => prev.map(v => v.field_id === fieldId ? { ...v, value } : v));
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        fields.forEach(field => {
            if (field.is_required) {
                const fieldValue = values.find(v => v.field_id === field.id);
                if (!fieldValue || fieldValue.value === null || fieldValue.value === '' || 
                    (Array.isArray(fieldValue.value) && fieldValue.value.length === 0)) {
                    newErrors[field.id] = `${field.label} is required`;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const responses: FormResponse[] = values.map(v => {
            const field = fields.find(f => f.id === v.field_id);
            if (!field) return { field_id: v.field_id };

            let response_text: string | undefined;
            let response_json: any;
            let file_url: string | undefined;

            if (field.field_type === 'file' && v.value instanceof File) {
                // File upload will be handled separately
                file_url = 'temp_file_url'; // This will be replaced with actual upload
            } else if (field.field_type === 'multi_select' && Array.isArray(v.value)) {
                response_json = v.value;
            } else if (typeof v.value === 'string') {
                response_text = v.value;
            }

            return { field_id: v.field_id, response_text, response_json, file_url };
        });

        onSubmit(responses, resume?.id ? parseInt(resume.id) : undefined);
    };

    const handleResumeUpload = async (file: File) => {
        setUploadingResume(true);
        setResumeError(null);

        try {
            // Validate file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                throw new Error('Only PDF, DOC, and DOCX files are allowed');
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                throw new Error('File size must be less than 5MB');
            }

            const uploadedResume = await uploadResume(file);
            setResume(uploadedResume);
        } catch (err) {
            setResumeError(err instanceof Error ? err.message : 'Failed to upload resume');
        } finally {
            setUploadingResume(false);
        }
    };

    const renderField = (field: FormField) => {
        const fieldValue = values.find(v => v.field_id === field.id);
        const value = fieldValue?.value;
        const error = errors[field.id];

        const baseClassName = "w-full rounded-lg border bg-slate-900/50 px-4 py-3 text-white outline-none transition-all focus:border-blue-500/50 focus:shadow-lg focus:shadow-blue-500/10";
        const errorClassName = error ? "border-rose-500/50" : "border-slate-800/50";

        switch (field.field_type) {
            case 'text':
            case 'email':
            case 'phone':
            case 'url':
                return (
                    <input
                        type={field.field_type}
                        placeholder={field.placeholder || ''}
                        value={value as string || ''}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        className={`${baseClassName} ${errorClassName}`}
                        required={field.is_required}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        placeholder={field.placeholder || ''}
                        value={value as string || ''}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        rows={4}
                        className={`${baseClassName} ${errorClassName} resize-none`}
                        required={field.is_required}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        placeholder={field.placeholder || ''}
                        value={value as string || ''}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        className={`${baseClassName} ${errorClassName}`}
                        required={field.is_required}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        value={value as string || ''}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        className={`${baseClassName} ${errorClassName}`}
                        required={field.is_required}
                    />
                );

            case 'time':
                return (
                    <input
                        type="time"
                        value={value as string || ''}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        className={`${baseClassName} ${errorClassName}`}
                        required={field.is_required}
                    />
                );

            case 'dropdown':
                return (
                    <select
                        value={value as string || ''}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        className={`${baseClassName} ${errorClassName}`}
                        required={field.is_required}
                    >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                            <option key={option.id} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option) => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={option.label}
                                    checked={value === option.label}
                                    onChange={(e) => updateValue(field.id, e.target.value)}
                                    className="w-4 h-4 accent-blue-500"
                                    required={field.is_required}
                                />
                                <span className="text-slate-300 group-hover:text-white transition-colors">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={value as boolean || false}
                            onChange={(e) => updateValue(field.id, e.target.checked)}
                            className="w-4 h-4 accent-blue-500"
                            required={field.is_required}
                        />
                        <span className="text-slate-300 group-hover:text-white transition-colors">
                            {field.label}
                        </span>
                    </label>
                );

            case 'multi_select':
                return (
                    <div className="space-y-2">
                        {field.options?.map((option) => {
                            const isSelected = Array.isArray(value) && value.includes(option.label);
                            return (
                                <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            const currentValues = Array.isArray(value) ? value : [];
                                            if (e.target.checked) {
                                                updateValue(field.id, [...currentValues, option.label]);
                                            } else {
                                                updateValue(field.id, currentValues.filter(v => v !== option.label));
                                            }
                                        }}
                                        className="w-4 h-4 accent-blue-500"
                                    />
                                    <span className="text-slate-300 group-hover:text-white transition-colors">
                                        {option.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                );

            case 'file':
                return (
                    <div className="relative">
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateValue(field.id, file);
                            }}
                            className="hidden"
                            id={`file-${field.id}`}
                            accept=".pdf,.doc,.docx"
                            required={field.is_required}
                        />
                        <label
                            htmlFor={`file-${field.id}`}
                            className={`flex items-center gap-3 rounded-lg border-2 border-dashed p-6 transition-all cursor-pointer ${
                                value instanceof File
                                    ? 'border-green-500/50 bg-green-500/10'
                                    : 'border-slate-700/50 bg-slate-900/30 hover:border-blue-500/50 hover:bg-blue-500/10'
                            }`}
                        >
                            {value instanceof File ? (
                                <>
                                    <FileText className="text-green-400" />
                                    <span className="text-green-300">{value.name}</span>
                                    <Check className="text-green-400 ml-auto" />
                                </>
                            ) : (
                                <>
                                    <Upload className="text-slate-400" />
                                    <span className="text-slate-400">
                                        {field.placeholder || 'Upload file (PDF, DOC, DOCX)'}
                                    </span>
                                </>
                            )}
                        </label>
                    </div>
                );

            case 'rating':
                const rating = value as number || 0;
                return (
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => updateValue(field.id, star)}
                                className={`text-2xl transition-all ${
                                    star <= rating ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                );

            case 'yes_no':
                return (
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={field.id}
                                value="yes"
                                checked={value === 'yes'}
                                onChange={(e) => updateValue(field.id, e.target.value)}
                                className="w-4 h-4 accent-blue-500"
                                required={field.is_required}
                            />
                            <span className="text-slate-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={field.id}
                                value="no"
                                checked={value === 'no'}
                                onChange={(e) => updateValue(field.id, e.target.value)}
                                className="w-4 h-4 accent-blue-500"
                                required={field.is_required}
                            />
                            <span className="text-slate-300">No</span>
                        </label>
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        placeholder={field.placeholder || ''}
                        value={value as string || ''}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        className={`${baseClassName} ${errorClassName}`}
                        required={field.is_required}
                    />
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-bold text-white">Application Form</h2>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Resume Section */}
                    <div className="space-y-3 rounded-xl border border-slate-800/50 bg-slate-900/30 p-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                            <FileText size={16} />
                            Resume
                        </label>
                        
                        {loadingResume ? (
                            <p className="text-slate-400 text-sm">Loading resume...</p>
                        ) : resume ? (
                            <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-blue-400" size={20} />
                                    <div>
                                        <p className="text-sm text-white">{resume.fileName}</p>
                                        <p className="text-xs text-slate-400">Uploaded {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : 'Recently'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-400 flex items-center gap-1">
                                        <Check size={12} />
                                        Active
                                    </span>
                                    <label className="cursor-pointer rounded-lg px-3 py-1 text-xs text-blue-400 hover:bg-blue-500/10 transition-all">
                                        Replace
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleResumeUpload(file);
                                            }}
                                            disabled={uploadingResume}
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="resume-upload"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleResumeUpload(file);
                                    }}
                                    disabled={uploadingResume}
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className={`flex items-center justify-center gap-3 rounded-lg border-2 border-dashed p-4 transition-all cursor-pointer ${
                                        uploadingResume
                                            ? 'border-slate-700/50 bg-slate-900/30 cursor-not-allowed opacity-50'
                                            : 'border-slate-700/50 bg-slate-900/30 hover:border-blue-500/50 hover:bg-blue-500/10'
                                    }`}
                                >
                                    {uploadingResume ? (
                                        <>
                                            <Upload className="text-slate-400 animate-pulse" />
                                            <span className="text-slate-400">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="text-slate-400" />
                                            <span className="text-slate-400">Upload your resume (PDF, DOC, DOCX)</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        )}
                        
                        {resumeError && (
                            <p className="text-sm text-rose-400">{resumeError}</p>
                        )}
                    </div>

                    <div className="border-t border-slate-800 pt-6">
                        <h3 className="text-sm font-medium text-white mb-4">Application Questions</h3>
                    </div>

                    {fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-white">
                                {field.label}
                                {field.is_required && <span className="text-rose-400">*</span>}
                            </label>
                            {renderField(field)}
                            {field.helper_text && (
                                <p className="text-xs text-slate-500">{field.helper_text}</p>
                            )}
                            {errors[field.id] && (
                                <p className="text-sm text-rose-400">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="rounded-lg border border-slate-700/50 px-6 py-3 text-white font-medium hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
