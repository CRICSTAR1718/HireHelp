import Card from "../ui/Card";

export default function NotificationSettings() {
    return (
        <Card>

            <h2 className="mb-6 text-xl font-semibold text-white">
                Notification Preferences
            </h2>

            <div className="space-y-5">

                <label className="flex items-center justify-between text-white">

                    Email Notifications

                    <input type="checkbox" defaultChecked />

                </label>

                <label className="flex items-center justify-between text-white">

                    Job Recommendations

                    <input type="checkbox" defaultChecked />

                </label>

                <label className="flex items-center justify-between text-white">

                    Interview Reminders

                    <input type="checkbox" defaultChecked />

                </label>

            </div>

        </Card>
    );
}