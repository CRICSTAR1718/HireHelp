import { useState, useEffect } from "react";
import { Card, Button, Input } from "../../../components/admin/ui";
import { Label } from "../../../components/admin/ui";
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
            <Card className="p-5">
                <h2 className="mb-6 text-lg font-semibold text-slate-900">Profile Information</h2>
                <p className="text-slate-500">Loading...</p>
            </Card>
        );
    }

    return (
        <Card className="p-5">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Profile Information</h2>

            {success && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                    Profile updated successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    {validationErrors.fullName && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.fullName}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="Email"
                        value={profile?.email || ""}
                        disabled
                        className="opacity-50"
                    />
                </div>

                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    {validationErrors.phone && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.phone}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                        id="linkedin"
                        placeholder="LinkedIn URL"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                    {validationErrors.linkedin && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.linkedin}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                        id="github"
                        placeholder="GitHub URL"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    />
                    {validationErrors.github && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.github}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                        id="portfolio"
                        placeholder="Portfolio URL"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    />
                    {validationErrors.portfolio && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.portfolio}</p>
                    )}
                </div>

                <Button type="submit" disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </Card>
    );
}