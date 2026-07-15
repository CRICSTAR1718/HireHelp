import { useEffect, useState } from "react";

import PageTitle from "../../../components/candidate/ui/PageTitle";
import NotificationList from "../../../components/candidate/notifications/NotificationList";
import NotificationStats from "../../../components/candidate/notifications/NotificationStats";
import Loader from "../../../components/candidate/ui/Loader";
import {
    getNotifications,
    getNotificationStats,
    markAllNotificationsRead,
} from "../../../api/candidate/notifications.api";
import type { Notification, NotificationStats as NotificationStatsType } from "../../../types/candidate";

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [stats, setStats] = useState<NotificationStatsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getNotifications(), getNotificationStats()])
            .then(([notificationData, statsData]) => {
                setNotifications(notificationData);
                setStats(statsData);
            })
            .catch((err) =>
                setError(err instanceof Error ? err.message : "Failed to load notifications")
            )
            .finally(() => setLoading(false));
    }, []);

    async function handleMarkAllRead() {
        await markAllNotificationsRead();
        setNotifications(await getNotifications());
        setStats(await getNotificationStats());
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageTitle
                title="Notifications"
                subtitle="Stay updated with your applications and interviews."
            />

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <NotificationList notifications={notifications} />
                </div>

                {stats && (
                    <NotificationStats stats={stats} onMarkAllRead={handleMarkAllRead} />
                )}
            </div>
        </div>
    );
}
