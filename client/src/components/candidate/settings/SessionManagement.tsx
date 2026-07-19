import { useState, useEffect } from "react";
import { Card, Button } from "../../../components/admin/ui";
import { StatusBadge } from "../../../components/admin/common";
import { useAuth } from "../../../hooks/candidate/useAuth";

interface Session {
    id: string;
    device: string;
    browser: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
}

export default function SessionManagement() {
    const { } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [logoutAllLoading, setLogoutAllLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            // Mock session data - in production, this would come from an API
            const mockSessions: Session[] = [
                {
                    id: "1",
                    device: "Windows PC",
                    browser: "Chrome",
                    location: "Bangalore, India",
                    lastActive: new Date().toISOString(),
                    isCurrent: true,
                },
            ];
            setSessions(mockSessions);
        } catch {
            setError("Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutAll = async () => {
        try {
            setLogoutAllLoading(true);
            setError(null);
            // Clear token from localStorage
            localStorage.removeItem("token");
            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } catch {
            setError("Failed to logout from all devices");
        } finally {
            setLogoutAllLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <Card className="p-5">
                <h2 className="mb-6 text-lg font-semibold text-slate-900">Session Management</h2>
                <p className="text-slate-500">Loading...</p>
            </Card>
        );
    }

    return (
        <Card className="p-5">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Session Management</h2>

            {success && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                    Logged out from all devices successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="space-y-4 mb-6">
                <div className="text-sm text-slate-500 mb-2">
                    Current Session
                </div>

                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`rounded-lg border p-4 ${
                            session.isCurrent
                                ? "border-blue-200 bg-blue-50"
                                : "border-slate-200 bg-slate-50"
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-slate-900 font-medium">
                                        {session.device}
                                    </span>
                                    {session.isCurrent && (
                                        <StatusBadge label="Current" tone="info" />
                                    )}
                                </div>
                                <div className="text-sm text-slate-600 space-y-1">
                                    <p>{session.browser}</p>
                                    <p>{session.location}</p>
                                    <p>Last active: {formatDate(session.lastActive)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {sessions.length === 0 && (
                    <p className="text-slate-500 text-sm">No active sessions found</p>
                )}
            </div>

            <Button
                variant="outline"
                onClick={handleLogoutAll}
                disabled={logoutAllLoading}
                className="w-full"
            >
                {logoutAllLoading ? "Logging out..." : "Logout from All Devices"}
            </Button>
        </Card>
    );
}
