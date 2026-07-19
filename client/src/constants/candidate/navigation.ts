import {
    LayoutDashboard,
    User,
    Briefcase,
    ClipboardList,
    Settings,
} from "lucide-react";

export const navigation = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "Profile",
        icon: User,
        path: "/profile",
    },
    {
        name: "Jobs",
        icon: Briefcase,
        path: "/jobs",
    },
    {
        name: "Applications",
        icon: ClipboardList,
        path: "/applications",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings",
    },
];