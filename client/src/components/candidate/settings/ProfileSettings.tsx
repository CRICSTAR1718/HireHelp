import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { getProfile, updateProfile } from "../../../api/candidate/profile.api";
import type { Profile } from "../../../types/candidate";

export default function ProfileSettings() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setProfile(data);
            setFormData({
                fullName: data.fullName || "",
                phone: data.phone || "",
                location: data.location || "",
                linkedin: data.linkedin || "",
                github: data.github || "",
                portfolio: data.portfolio || "",
            });
        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            errors.fullName = "Full name is required";
        }

        if (formData.phone && !/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
            errors.phone = "Invalid phone number format";
        }

        if (formData.linkedin && !isValidUrl(formData.linkedin)) {
            errors.linkedin = "Invalid LinkedIn URL";
        }

        if (formData.github && !isValidUrl(formData.github)) {
            errors.github = "Invalid GitHub URL";
        }

        if (formData.portfolio && !isValidUrl(formData.portfolio)) {
            errors.portfolio = "Invalid portfolio URL";
        }

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            await updateProfile(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <h2 className="mb-6 text-xl font-semibold text-white">Profile Information</h2>
                <p className="text-slate-400">Loading...</p>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="mb-6 text-xl font-semibold text-white">Profile Information</h2>

            {success && (
                <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-300">
                    Profile updated successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Input
                        label="Full Name"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={validationErrors.fullName ? "border-rose-500" : ""}
                    />
                    {validationErrors.fullName && (
                        <p className="mt-1 text-sm text-rose-400">{validationErrors.fullName}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Email"
                        placeholder="Email"
                        value={profile?.email || ""}
                        disabled
                        className="opacity-50"
                    />
                </div>

                <div>
                    <Input
                        label="Phone Number"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={validationErrors.phone ? "border-rose-500" : ""}
                    />
                    {validationErrors.phone && (
                        <p className="mt-1 text-sm text-rose-400">{validationErrors.phone}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div>
                    <Input
                        label="LinkedIn URL"
                        placeholder="LinkedIn URL"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className={validationErrors.linkedin ? "border-rose-500" : ""}
                    />
                    {validationErrors.linkedin && (
                        <p className="mt-1 text-sm text-rose-400">{validationErrors.linkedin}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="GitHub URL"
                        placeholder="GitHub URL"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className={validationErrors.github ? "border-rose-500" : ""}
                    />
                    {validationErrors.github && (
                        <p className="mt-1 text-sm text-rose-400">{validationErrors.github}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Portfolio URL"
                        placeholder="Portfolio URL"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                        className={validationErrors.portfolio ? "border-rose-500" : ""}
                    />
                    {validationErrors.portfolio && (
                        <p className="mt-1 text-sm text-rose-400">{validationErrors.portfolio}</p>
                    )}
                </div>

                <Button type="submit" loading={saving} fullWidth>
                    Save Changes
                </Button>
            </form>
        </Card>
    );
}