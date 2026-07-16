import { Bell, ClipboardCheck, FileText, LayoutDashboard, Settings, ShieldCheck, SlidersHorizontal, Users, UsersRound, Building2, Briefcase, Plus, GitPullRequest, User, Star, Calendar, BarChart2, Bell as BellIcon, Clock } from "lucide-react";
import type { NavigationGroup } from "../../types/admin/navigation";

export const navigationGroups: NavigationGroup[] = [
  { label: "Dashboard", items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  { label: "Recruitment", items: [
    { label: "Requisitions", href: "/admin/requisitions", icon: Briefcase },
    { label: "Create Requisition", href: "/admin/requisitions/new", icon: Plus },
    { label: "Applications", href: "/admin/applications", icon: FileText },
    { label: "Pipeline", href: "/admin/pipeline", icon: GitPullRequest },
    { label: "Candidates", href: "/admin/candidates", icon: User },
    { label: "Talent Pool", href: "/admin/talent-pool", icon: Star },
    { label: "Interviews", href: "/admin/interviews", icon: Calendar },
    { label: "Schedule Interview", href: "/admin/schedule-interview", icon: Clock },
  ]},
  { label: "Reviews", items: [
    { label: "Requisition Review", href: "/admin/requisitions/review", icon: ClipboardCheck },
    { label: "Form Approvals", href: "/admin/forms/approvals", icon: FileText },
  ]},
  { label: "Analytics", items: [
    { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { label: "Reports", href: "/admin/reports", icon: FileText },
  ]},
  { label: "Management", items: [{ label: "Users", href: "/admin/users", icon: Users }, { label: "Roles", href: "/admin/roles", icon: UsersRound }, { label: "Permissions", href: "/admin/permissions", icon: ShieldCheck }, { label: "Departments", href: "/admin/departments", icon: Building2 }] },
  { label: "System", items: [{ label: "Configuration", href: "/admin/configuration", icon: SlidersHorizontal }, { label: "Audit Logs", href: "/admin/audit", icon: FileText }] },
  { label: "Notifications", items: [{ label: "Notifications", href: "/admin/notifications", icon: BellIcon }] },
  { label: "Settings", items: [{ label: "Settings", href: "/admin/settings", icon: Settings }] },
];

export const headerIcons = { Bell, Settings };