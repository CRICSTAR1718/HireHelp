import { useAuth } from "../../../hooks/shared/useAuth";

export default function Header() {
    const { user } = useAuth();
    const displayName = user?.full_name || user?.email || "Candidate";
    const initial = displayName.charAt(0).toUpperCase();

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="flex h-20 items-center justify-between border-b border-blue-100 bg-white/90 px-8">

            {/* Left */}

            <div>

                <h2 className="text-2xl font-bold text-slate-900">
                    Welcome Back 👋
                </h2>

                <p className="text-sm text-slate-500">
                    {today}
                </p>

            </div>

            {/* Right - Profile Avatar Only */}

            <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40 cursor-pointer">

                    {initial}

                </div>

            </div>

        </header>
    );
}