import {
    Search,
    Bell,
    Settings,
} from "lucide-react";

export default function Header() {

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

            {/* Search */}

            <div className="hidden w-105 lg:block">

                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-500/10">

                    <Search
                        size={18}
                        className="text-slate-400 transition-colors"
                    />

                    <input
                        placeholder="Search jobs..."
                        className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                    />

                </div>

            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

                <button className="rounded-xl bg-slate-50 p-3 text-slate-500 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/10">

                    <Bell size={20} />

                </button>

                <button className="rounded-xl bg-slate-50 p-3 text-slate-500 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/10">

                    <Settings size={20} />

                </button>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/40 cursor-pointer">

                    A

                </div>

            </div>

        </header>
    );
}