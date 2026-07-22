import { SectionTitle } from "../../../components/admin/common";
import ProfileSettings from "../../../components/candidate/settings/ProfileSettings";
import PasswordSettings from "../../../components/candidate/settings/PasswordSettings";

export default function Settings() {
    return (
        <div className="space-y-8">
            <SectionTitle
                description="Manage your account preferences."
                title="Settings"
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <ProfileSettings />
                <PasswordSettings />
            </div>
        </div>
    );
}