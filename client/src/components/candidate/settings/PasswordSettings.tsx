import { useState } from "react";
import { Card, Button } from "../../../components/admin/ui";
import { Label } from "../../../components/admin/ui";
import PasswordInput from "../ui/PasswordInput";
import { changePassword } from "../../../api/candidate/settings.api";

export default function PasswordSettings() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.currentPassword) {
            errors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            errors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            errors.newPassword = "Password must contain uppercase, lowercase, and number";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess(true);
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-5">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Change Password</h2>

            {success && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                    Password changed successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <PasswordInput
                        placeholder="Current Password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    />
                    {validationErrors.currentPassword && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.currentPassword}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <PasswordInput
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    />
                    {validationErrors.newPassword && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.newPassword}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                        Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <PasswordInput
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    {validationErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-rose-600">{validationErrors.confirmPassword}</p>
                    )}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </form>
        </Card>
    );
}