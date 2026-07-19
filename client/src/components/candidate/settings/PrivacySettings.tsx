import { useState, useEffect } from "react";
import { Card, Button } from "../../../components/admin/ui";
import { getSettings, updatePrivacySettings, deleteAccount } from "../../../api/candidate/settings.api";
import type { PrivacySettings } from "../../../api/candidate/settings.api";

export default function PrivacySettings() {
    const [settings, setSettings] = useState<PrivacySettings>({
        profileVisibility: true,
        allowRecruiterDiscovery: true,
        includeInTalentPool: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await getSettings();
            setSettings({
                profileVisibility: data.profileVisibility ?? true,
                allowRecruiterDiscovery: data.allowRecruiterDiscovery ?? true,
                includeInTalentPool: data.includeInTalentPool ?? true,
            });
        } catch {
            setError("Failed to load privacy settings");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key: keyof PrivacySettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);

        try {
            setSaving(true);
            setError(null);
            await updatePrivacySettings(newSettings);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch {
            setError("Failed to update privacy settings");
            setSettings(settings); // Revert on error
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setDeleting(true);
            await deleteAccount();
            // Redirect to login or home page after deletion
            window.location.href = "/login";
        } catch {
            setError("Failed to delete account");
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-5">
                <h2 className="mb-6 text-lg font-semibold text-slate-900">Privacy Settings</h2>
                <p className="text-slate-500">Loading...</p>
            </Card>
        );
    }

    return (
        <Card className="p-5">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Privacy Settings</h2>

            {success && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                    Privacy settings updated successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="space-y-4 mb-8">
                <label className="flex items-center justify-between text-slate-700 cursor-pointer group">
                    <div>
                        <span className="group-hover:text-slate-900 transition-colors">Profile Visibility</span>
                        <p className="text-xs text-slate-500 mt-1">Make your profile visible to others</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleToggle("profileVisibility")}
                        disabled={saving}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.profileVisibility ? "bg-blue-600" : "bg-slate-300"
                        } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                settings.profileVisibility ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between text-slate-700 cursor-pointer group">
                    <div>
                        <span className="group-hover:text-slate-900 transition-colors">Allow Recruiters to Discover Profile</span>
                        <p className="text-xs text-slate-500 mt-1">Let recruiters find you in search results</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleToggle("allowRecruiterDiscovery")}
                        disabled={saving}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.allowRecruiterDiscovery ? "bg-blue-600" : "bg-slate-300"
                        } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                settings.allowRecruiterDiscovery ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between text-slate-700 cursor-pointer group">
                    <div>
                        <span className="group-hover:text-slate-900 transition-colors">Include in Talent Pool</span>
                        <p className="text-xs text-slate-500 mt-1">Be included in the talent pool database</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleToggle("includeInTalentPool")}
                        disabled={saving}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.includeInTalentPool ? "bg-blue-600" : "bg-slate-300"
                        } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                settings.includeInTalentPool ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </label>
            </div>

            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Danger Zone</h3>
                <p className="text-sm text-slate-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                    Delete Account
                </Button>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-2xl p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Delete Account</h3>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="flex-1 bg-rose-600 hover:bg-rose-700"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
