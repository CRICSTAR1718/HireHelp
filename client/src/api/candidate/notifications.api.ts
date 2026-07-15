import api from "./api";
import type { Notification, NotificationStats } from "../../types/candidate";

export async function getNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>("/notifications");
    return response.data;
}

export async function getNotificationStats(): Promise<NotificationStats> {
    // TODO(backend): the merged server only exposes /unread-count (a plain
    // number), not the categorized {total, unread, interviews, applications}
    // shape this type promises. Using unread-count for the one field we can
    // actually get; the rest are placeholders until that endpoint exists.
    try {
        const response = await api.get<{ count: number }>("/notifications/unread-count");
        return { total: 0, unread: response.data.count, interviews: 0, applications: 0 };
    } catch {
        return { total: 0, unread: 0, interviews: 0, applications: 0 };
    }
}

export async function markAllNotificationsRead(): Promise<void> {
    // Backend route is POST /mark-all-read (not PATCH /read-all), and it
    // returns no body — matches server/modules/candidates/notifications.
    await api.post("/notifications/mark-all-read");
}
