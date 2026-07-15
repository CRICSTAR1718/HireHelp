interface Props {
    notifications: string[];
}

export default function NotificationsPanel({ notifications }: Props) {
    const safeNotifications = notifications ?? [];

    return (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

            <h2 className="text-xl font-bold text-white mb-6">
                Notifications
            </h2>

            {safeNotifications.length === 0 ? (
                <p className="text-slate-400">No notifications yet.</p>
            ) : (

                <div className="space-y-5">
                    {safeNotifications.map((note, index) => (
                        <div
                            key={index}
                            className="border-b border-slate-800 pb-3"
                        >
                            <p className="text-slate-300">
                                {note}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
