import PageTitle from "../../../components/candidate/ui/PageTitle";

import ProfileSettings from "../../../components/candidate/settings/ProfileSettings";
import PasswordSettings from "../../../components/candidate/settings/PasswordSettings";
import NotificationSettings from "../../../components/candidate/settings/NotificationSettings";
import PrivacySettings from "../../../components/candidate/settings/PrivacySettings";
import SessionManagement from "../../../components/candidate/settings/SessionManagement";

export default function Settings() {
    return (
        <div className="space-y-8">

            <PageTitle
                title="Settings"
                subtitle="Manage your account preferences."
            />

            <div className="grid gap-6 lg:grid-cols-2">

                <ProfileSettings />

                <PasswordSettings />

                <NotificationSettings />

                <PrivacySettings />

                <SessionManagement />

            </div>

        </div>
    );
}