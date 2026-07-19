import { useState, useEffect } from "react";
import Card from "../ui/Card";
import { getSettings, updateEmailPreferences } from "../../../api/candidate/settings.api";
import type { EmailPreferences } from "../../../api/candidate/settings.api";

export default function NotificationSettings() {
    const [preferences, setPreferences] = useState<EmailPreferences>({
        jobAlerts: true,
        applicationUpdates: true,
        interviewEmails: true,
        marketingEmails: false,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await getSettings();
            setPreferences({
                jobAlerts: data.jobAlerts ?? true,
                applicationUpdates: data.applicationUpdates ?? true,
                interviewEmails: data.interviewEmails ?? true,
                marketingEmails: data.marketingEmails ?? false,
            });
        } catch {
            setError("Failed to load preferences");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key: keyof EmailPreferences) => {
        const newPreferences = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPreferences);

        try {
            setSaving(true);
            setError(null);
            await updateEmailPreferences(newPreferences);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch {
            setError("Failed to update preferences");
            setPreferences(preferences); // Revert on error
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <h2 className="mb-6 text-xl font-semibold text-white">Email Preferences</h2>
                <p className="text-slate-400">Loading...</p>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="mb-6 text-xl font-semibold text-white">Email Preferences</h2>

            {success && (
                <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-300">
                    Preferences updated successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-300">
                    {error}
                </div>
            )}

            <div className="space-y-5">
                <label className="flex items-center justify-between text-white cursor-pointer group">
                    <span className="group-hover:text-blue-400 transition-colors">Job Alerts</span>
                    <button
                        type="button"
                        onClick={() => handleToggle("jobAlerts")}
                        disabled={saving}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            preferences.jobAlerts ? "bg-blue-600" : "bg-slate-700"
                        } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                preferences.jobAlerts ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between text-white cursor-pointer group">
                    <span className="group-hover:text-blue-400 transition-colors">Application Status Updates</span>
                    <button
                        type="button"
                        onClick={() => handleToggle("applicationUpdates")}
                        disabled={saving}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            preferences.applicationUpdates ? "bg-blue-600" : "bg-slate-700"
                        } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                preferences.applicationUpdates ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between text-white cursor-pointer group">
                    <span className="group-hover:text-blue-400 transition-colors">Interview Emails</span>
                    <button
                        type="button"
                        onClick={() => handleToggle("interviewEmails")}
                        disabled={saving}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            preferences.interviewEmails ? "bg-blue-600" : "bg-slate-700"
                        } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                preferences.interviewEmails ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </label>

                <label className="flex items-center justify-between text-white cursor-pointer group">
                    <span className="group-hover:text-blue-400 transition-colors">Marketing Emails</span>
                    <button
                        type="button"
                        onClick={() => handleToggle("marketingEmails")}
                        disabled={saving}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            preferences.marketingEmails ? "bg-blue-600" : "bg-slate-700"
                        } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                preferences.marketingEmails ? "left-7" : "left-1"
                            }`}
                        />
                    </button>
                </label>
            </div>
        </Card>
    );
}