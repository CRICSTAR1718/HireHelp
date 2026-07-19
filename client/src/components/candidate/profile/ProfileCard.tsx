import { Mail, Phone, MapPin } from "lucide-react";
import { Card, Button } from "../../../components/admin/ui";
import { UserAvatar } from "../../../components/admin/common";
import type { Profile } from "../../../types/candidate";

interface Props {
    profile: Profile;
    onEditProfile?: () => void;
}

export default function ProfileCard({ profile, onEditProfile }: Props) {
    return (
        <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <UserAvatar 
                    firstName={profile.fullName.split(' ')[0]} 
                    lastName={profile.fullName.split(' ')[1] || ''} 
                    className="h-16 w-16 text-lg"
                />
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{profile.fullName}</h3>
                    <p className="text-sm text-slate-500">{profile.headline ?? "Candidate"}</p>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                </div>

                {profile.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-4 w-4" />
                        {profile.phone}
                    </div>
                )}

                {profile.location && (
                    <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                    </div>
                )}
            </div>

            {onEditProfile && (
                <Button 
                    onClick={onEditProfile}
                    className="mt-6 w-full"
                >
                    Edit Profile
                </Button>
            )}
        </Card>
    );
}
