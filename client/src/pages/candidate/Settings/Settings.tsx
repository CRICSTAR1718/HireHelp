import PageTitle from "../../../components/candidate/ui/PageTitle";

import ProfileSettings from "../../../components/candidate/settings/ProfileSettings";
import PasswordSettings from "../../../components/candidate/settings/PasswordSettings";
import NotificationSettings from "../../../components/candidate/settings/NotificationSettings";
import AppearanceSettings from "../../../components/candidate/settings/AppearanceSettings";
import DangerZone from "../../../components/candidate/settings/DangerZone";

import Button from "../../../components/candidate/ui/Button";

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

                <AppearanceSettings />

            </div>

            <div className="flex justify-end">
                <Button>
                    Logout
                </Button>
            </div>

            <DangerZone />

        </div>
    );
}