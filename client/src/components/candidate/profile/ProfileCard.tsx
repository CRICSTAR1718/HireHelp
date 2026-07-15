import { Mail, Phone, MapPin } from "lucide-react";
import type { Profile } from "../../../types/candidate";

interface Props {
    profile: Profile;
    onEditProfile?: () => void;
}

export default function ProfileCard({ profile, onEditProfile }: Props) {
    return (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 shadow-lg hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center gap-5">
                <img
                    src={profile.profilePictureUrl || "https://i.pravatar.cc/150?img=12"}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:scale-105 object-cover"
                />

                <div>
                    <h2 className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        {profile.fullName}
                    </h2>

                    <p className="text-slate-400">
                        {profile.headline ?? "Candidate"}
                    </p>
                </div>
            </div>

            <div className="mt-8 space-y-4 text-slate-300">
                <div className="flex items-center gap-3 group hover:text-blue-400 transition-colors">
                    <Mail size={18} className="group-hover:scale-110 transition-transform" />
                    {profile.email}
                </div>

                {profile.phone && (
                    <div className="flex items-center gap-3 group hover:text-blue-400 transition-colors">
                        <Phone size={18} className="group-hover:scale-110 transition-transform" />
                        {profile.phone}
                    </div>
                )}

                {profile.location && (
                    <div className="flex items-center gap-3 group hover:text-blue-400 transition-colors">
                        <MapPin size={18} className="group-hover:scale-110 transition-transform" />
                        {profile.location}
                    </div>
                )}
            </div>

            <button 
                onClick={() => {
                    console.log('Edit Profile button clicked');
                    if (onEditProfile) onEditProfile();
                }}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]"
            >
                Edit Profile
            </button>
        </div>
    );
}
