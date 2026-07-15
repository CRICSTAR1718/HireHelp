import {
    LayoutDashboard,
    User,
    FileText,
    Briefcase,
    ClipboardList,
    Calendar,
    Bell,
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
        name: "Resume",
        icon: FileText,
        path: "/resume",
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
        name: "Interviews",
        icon: Calendar,
        path: "/interviews",
    },
    {
        name: "Notifications",
        icon: Bell,
        path: "/notifications",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings",
    },
];