import { LayoutDashboard, Briefcase, ClipboardList } from "lucide-react";
import type { NavigationGroup } from "../../types/admin/navigation";

export const navigationGroups: NavigationGroup[] = [
  { label: "Main", items: [
    { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
    { label: "Jobs", href: "/candidate/jobs", icon: Briefcase },
    { label: "Applications", href: "/candidate/applications", icon: ClipboardList },
  ]},
];