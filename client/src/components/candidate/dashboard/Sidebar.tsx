import {
    LayoutDashboard,
    User,
    BriefcaseBusiness,
    ClipboardList,
    LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/shared/useAuth";

const menu = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/candidate/dashboard",
    },
    {
        title: "Profile",
        icon: User,
        path: "/candidate/profile",
    },
    {
        title: "Jobs",
        icon: BriefcaseBusiness,
        path: "/candidate/jobs",
    },
    {
        title: "Applications",
        icon: ClipboardList,
        path: "/candidate/applications",
    },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const displayName = user?.full_name || user?.email || "Candidate";
    const initial = displayName.charAt(0).toUpperCase();

    const handleLogout = () => {
        logout();
        navigate("/candidate");
    };

    return (
        <aside className="flex h-full w-72 flex-col bg-white/95 border-r border-blue-100">

            {/* Logo */}

            <div className="border-b border-blue-100 px-8 py-8 bg-gradient-to-r from-blue-50 to-transparent">

                <h1 className="text-3xl font-extrabold tracking-tight text-blue-700">
                    HireHelp
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Candidate Portal
                </p>

            </div>

            {/* Navigation */}

            <nav className="flex-1 space-y-2 px-4 py-6">

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.title}
                            to={item.path}
                            end={item.path === "/candidate/dashboard"}
                            className={({ isActive }) =>
                                `
                                flex items-center gap-4 rounded-xl px-4 py-3
                                transition-all duration-300 ease-out
                                ${isActive
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:scale-[1.02]"
                                }
                                `
                            }
                        >
                            <Icon size={20} className={item.path === "/candidate/dashboard" ? "animate-pulse" : ""} />

                            <span className="font-medium">
                                {item.title}
                            </span>

                        </NavLink>
                    );
                })}

            </nav>

            {/* User */}

            <div className="border-t border-blue-100 p-5 bg-gradient-to-t from-slate-50 to-transparent">

                <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
                        {initial}
                    </div>

                    <div>

                        <h3 className="font-semibold text-slate-900">
                            {displayName}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {user?.email ?? ""}
                        </p>

                    </div>

                </div>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02]"
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </aside>
    );
}