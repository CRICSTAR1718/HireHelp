import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ProfileSettings() {
    return (
        <Card>

            <h2 className="mb-6 text-xl font-semibold text-white">
                Profile Information
            </h2>

            <div className="space-y-5">

                <Input placeholder="Full Name" defaultValue="Anushka Berlia" />

                <Input
                    placeholder="Email"
                    defaultValue="anushka@email.com"
                />

                <Input
                    placeholder="Phone Number"
                    defaultValue="+91 9876543210"
                />

                <Input
                    placeholder="Location"
                    defaultValue="Bangalore"
                />

                <Button>
                    Save Changes
                </Button>

            </div>

        </Card>
    );
}