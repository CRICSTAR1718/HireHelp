import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
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
            <Card>
                <h2 className="mb-6 text-xl font-semibold text-white">Session Management</h2>
                <p className="text-slate-400">Loading...</p>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="mb-6 text-xl font-semibold text-white">Session Management</h2>

            {success && (
                <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-300">
                    Logged out from all devices successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-300">
                    {error}
                </div>
            )}

            <div className="space-y-4 mb-6">
                <div className="text-sm text-slate-400 mb-2">
                    Current Session
                </div>

                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`rounded-lg border p-4 ${
                            session.isCurrent
                                ? "border-blue-500/30 bg-blue-500/10"
                                : "border-slate-800 bg-slate-900/50"
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white font-medium">
                                        {session.device}
                                    </span>
                                    {session.isCurrent && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-400 space-y-1">
                                    <p>{session.browser}</p>
                                    <p>{session.location}</p>
                                    <p>Last active: {formatDate(session.lastActive)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {sessions.length === 0 && (
                    <p className="text-slate-400 text-sm">No active sessions found</p>
                )}
            </div>

            <Button
                variant="secondary"
                onClick={handleLogoutAll}
                loading={logoutAllLoading}
                fullWidth
            >
                Logout from All Devices
            </Button>
        </Card>
    );
}
