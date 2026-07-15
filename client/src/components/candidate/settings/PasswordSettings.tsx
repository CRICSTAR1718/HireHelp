import Card from "../ui/Card";
import Button from "../ui/Button";
import PasswordInput from "../ui/PasswordInput";

export default function PasswordSettings() {
    return (
        <Card>

            <h2 className="mb-6 text-xl font-semibold text-white">
                Change Password
            </h2>

            <div className="space-y-5">

                <PasswordInput placeholder="Current Password" />

                <PasswordInput placeholder="New Password" />

                <PasswordInput placeholder="Confirm Password" />

                <Button>
                    Update Password
                </Button>

            </div>

        </Card>
    );
}