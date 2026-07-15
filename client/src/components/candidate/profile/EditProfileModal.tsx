import { useState, useEffect } from "react";
import { X, Save, Upload, Plus, X as XIcon } from "lucide-react";
import type { Profile } from "../../../types/candidate";
import { updateProfile, uploadProfilePicture } from "../../../api/candidate/profile.api";

interface Props {
    profile: Profile;
    onClose: () => void;
    onSave: (updatedProfile: Profile) => void;
}

export default function EditProfileModal({ profile, onClose, onSave }: Props) {
    const [formData, setFormData] = useState<Profile>({ ...profile });
    const [saving, setSaving] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        console.log('EditProfileModal opened with profile:', profile);
        setFormData({ ...profile });
    }, [profile]);

    const handleChange = (field: keyof Profile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (formData.fullName && formData.fullName.trim().length < 2) {
            errors.fullName = 'Full name must be at least 2 characters';
        }

        if (formData.phone && !/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
            errors.phone = 'Invalid phone number format';
        }

        const urlFields = ['linkedin', 'github', 'portfolio'] as const;
        urlFields.forEach((field) => {
            const value = formData[field];
            if (value && value.trim() !== '' && !isValidUrl(value)) {
                errors[field] = 'Invalid URL format';
            }
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const addSkill = () => {
        const trimmedSkill = newSkill.trim();
        if (!trimmedSkill) return;

        if (formData.skills?.includes(trimmedSkill)) {
            setError('This skill already exists');
            return;
        }

        setFormData(prev => ({
            ...prev,
            skills: [...(prev.skills || []), trimmedSkill]
        }));
        setNewSkill('');
        setError(null);
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
        }));
    };

    const handleSkillKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        console.log('Uploading profile picture:', file.name);
        setUploadingPicture(true);
        setError(null);

        try {
            const result = await uploadProfilePicture(file);
            console.log('Profile picture uploaded successfully:', result);
            setFormData(prev => ({ ...prev, profilePictureUrl: result.profilePictureUrl }));
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error('Failed to upload profile picture:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload profile picture');
        } finally {
            setUploadingPicture(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting profile update:', formData);
        
        if (!validateForm()) {
            setError('Please fix validation errors before saving');
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Prepare payload - only send fields that exist in the schema
            const payload = {
                fullName: formData.fullName,
                headline: formData.headline,
                summary: formData.summary,
                location: formData.location,
                phone: formData.phone,
                linkedin: formData.linkedin || '',
                github: formData.github || '',
                portfolio: formData.portfolio || '',
                skills: formData.skills || [],
            };

            console.log('Sending payload to API:', payload);
            const updatedProfile = await updateProfile(payload);
            console.log('Profile updated successfully:', updatedProfile);
            setSuccess(true);
            onSave(updatedProfile);
            
            // Close modal after successful save
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Failed to update profile:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            // Stay on the page, don't crash
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        console.log('Edit Profile cancelled');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button
                        onClick={handleCancel}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Success Message */}
                    {success && (
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200">
                            Profile updated successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                            {error}
                        </div>
                    )}

                    {/* Profile Picture */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            <img
                                src={formData.profilePictureUrl || "https://i.pravatar.cc/150?img=12"}
                                alt="Profile"
                                className="h-20 w-20 rounded-full border-2 border-slate-700 object-cover"
                            />
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleProfilePictureUpload}
                                    disabled={uploadingPicture}
                                    className="hidden"
                                    id="profile-picture-input"
                                />
                                <label
                                    htmlFor="profile-picture-input"
                                    className={`flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-all cursor-pointer ${
                                        uploadingPicture ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <Upload size={16} />
                                    {uploadingPicture ? 'Uploading...' : 'Upload New Picture'}
                                </label>
                                <p className="text-xs text-slate-500">JPEG, PNG, WebP (max 5MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-white">Basic Information</h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName || ''}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    validationErrors.fullName ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 bg-slate-800'
                                }`}
                                placeholder="Enter your full name"
                            />
                            {validationErrors.fullName && (
                                <p className="text-xs text-rose-400">{validationErrors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                disabled
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-slate-400 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed"
                                placeholder="your.email@example.com"
                            />
                            <p className="text-xs text-slate-500">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    validationErrors.phone ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 bg-slate-800'
                                }`}
                                placeholder="+1 234 567 8900"
                            />
                            {validationErrors.phone && (
                                <p className="text-xs text-rose-400">{validationErrors.phone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Headline</label>
                            <input
                                type="text"
                                value={formData.headline || ''}
                                onChange={(e) => handleChange('headline', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Software Developer | Full Stack"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Location</label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="City, State, Country"
                            />
                        </div>
                    </div>

                    {/* Professional Links */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-white">Professional Links</h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">LinkedIn URL</label>
                            <input
                                type="url"
                                value={formData.linkedin || ''}
                                onChange={(e) => handleChange('linkedin', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    validationErrors.linkedin ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 bg-slate-800'
                                }`}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                            {validationErrors.linkedin && (
                                <p className="text-xs text-rose-400">{validationErrors.linkedin}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">GitHub URL</label>
                            <input
                                type="url"
                                value={formData.github || ''}
                                onChange={(e) => handleChange('github', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    validationErrors.github ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 bg-slate-800'
                                }`}
                                placeholder="https://github.com/yourusername"
                            />
                            {validationErrors.github && (
                                <p className="text-xs text-rose-400">{validationErrors.github}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Portfolio URL</label>
                            <input
                                type="url"
                                value={formData.portfolio || ''}
                                onChange={(e) => handleChange('portfolio', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    validationErrors.portfolio ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 bg-slate-800'
                                }`}
                                placeholder="https://yourportfolio.com"
                            />
                            {validationErrors.portfolio && (
                                <p className="text-xs text-rose-400">{validationErrors.portfolio}</p>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Skills</label>
                        
                        {/* Add Skill Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={handleSkillKeyPress}
                                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Add a skill (e.g., React)"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-all"
                            >
                                <Plus size={16} />
                                Add
                            </button>
                        </div>

                        {/* Skills List */}
                        {formData.skills && formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-white"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-slate-400 hover:text-rose-400 transition-colors"
                                        >
                                            <XIcon size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-slate-500">Press Enter or click Add to add skills. Click X to remove.</p>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Summary</label>
                        <textarea
                            value={formData.summary || ''}
                            onChange={(e) => handleChange('summary', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px]"
                            placeholder="Brief professional summary..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="rounded-lg border border-slate-700/50 px-6 py-3 text-white hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
