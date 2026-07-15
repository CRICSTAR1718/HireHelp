import { Bell, ClipboardCheck, FileText, LayoutDashboard, Settings, ShieldCheck, SlidersHorizontal, Users, UsersRound, Building2 } from "lucide-react";
import type { NavigationGroup } from "../../types/admin/navigation";

export const navigationGroups: NavigationGroup[] = [
  { label: "Dashboard", items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  { label: "Management", items: [{ label: "Users", href: "/admin/users", icon: Users }, { label: "Roles", href: "/admin/roles", icon: UsersRound }, { label: "Permissions", href: "/admin/permissions", icon: ShieldCheck }, { label: "Departments", href: "/admin/departments", icon: Building2 }] },
  { label: "System", items: [{ label: "Configuration", href: "/admin/configuration", icon: SlidersHorizontal }, { label: "Audit Logs", href: "/admin/audit", icon: FileText }] },
  { label: "Workflow", items: [{ label: "Approvals", href: "/admin/approvals", icon: ClipboardCheck }] },
];

export const headerIcons = { Bell, Settings };