import NotificationCard from "./NotificationCard";
import type { Notification } from "../../../types/candidate";

interface Props {
    notifications: Notification[];
}

export default function NotificationList({ notifications }: Props) {
    if (notifications.length === 0) {
        return <p className="text-slate-400">No notifications yet.</p>;
    }

    return (
        <div className="space-y-5">
            {notifications.map((notification) => (
                <NotificationCard
                    key={notification.id}
                    title={notification.title}
                    message={notification.message}
                    time={notification.time}
                    type={notification.type}
                    unread={notification.unread}
                />
            ))}
        </div>
    );
}
