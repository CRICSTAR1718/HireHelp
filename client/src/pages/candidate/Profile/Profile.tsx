import { useEffect, useState } from "react";
import { SectionTitle, LoadingState } from "../../../components/admin/common";
import ProfileCard from "../../../components/candidate/profile/ProfileCard";
import SkillsCard from "../../../components/candidate/profile/SkillsCard";
import EducationCard from "../../../components/candidate/profile/EducationCard";
import ExperienceCard from "../../../components/candidate/profile/ExperienceCard";
import EditProfileModal from "../../../components/candidate/profile/EditProfileModal";
import { getProfile } from "../../../api/candidate/profile.api";
import { toUserMessage } from "../../../utils/toUserMessage";
import type { Profile } from "../../../types/candidate";

export default function Profile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProfile, setEditingProfile] = useState(false);

    useEffect(() => {
        getProfile()
            .then(setProfile)
            .catch((err) =>
                setError(toUserMessage(err, "Failed to load profile. Please try again."))
            )
            .finally(() => setLoading(false));
    }, []);

    const handleEditProfile = () => {
        console.log('Edit Profile requested');
        setEditingProfile(true);
    };

    const handleCloseEdit = () => {
        console.log('Edit Profile closed');
        setEditingProfile(false);
    };

    const handleProfileSave = (updatedProfile: Profile) => {
        console.log('Profile saved:', updatedProfile);
        setProfile(updatedProfile);
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error || !profile) {
        return (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                {error ?? "Profile not found"}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <SectionTitle
                description="Manage your professional profile."
                title="Profile"
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <ProfileCard profile={profile} onEditProfile={handleEditProfile} />

                <div className="lg:col-span-2 space-y-6">
                    <SkillsCard skills={profile.skills} />
                    <EducationCard education={profile.education} />
                    <ExperienceCard experience={profile.experience} />
                </div>
            </div>

            {/* Edit Profile Modal */}
            {editingProfile && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={handleCloseEdit}
                    onSave={handleProfileSave}
                />
            )}
        </div>
    );
}
