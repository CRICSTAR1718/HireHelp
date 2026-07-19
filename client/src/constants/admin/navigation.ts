import { ClipboardCheck, FileText, LayoutDashboard, ShieldCheck, Users, UsersRound, Building2, Briefcase, Plus, GitPullRequest, User, Star, Calendar, Clock, Link } from "lucide-react";
import type { NavigationGroup } from "../../types/admin/navigation";

export const navigationGroups: NavigationGroup[] = [
  { label: "Dashboard", items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  { label: "Recruitment", items: [
    { label: "Requisitions", href: "/admin/requisitions", icon: Briefcase },
    { label: "Create Requisition", href: "/admin/requisitions/new", icon: Plus },
    { label: "Pipeline", href: "/admin/pipeline", icon: GitPullRequest },
    { label: "Candidates", href: "/admin/candidates", icon: User },
    { label: "Talent Pool", href: "/admin/talent-pool", icon: Star },
    { label: "Interviews", href: "/admin/interviews", icon: Calendar },
    { label: "Schedule Interview", href: "/admin/schedule-interview", icon: Clock },
    { label: "Cal.com Setup", href: "/admin/integrations", icon: Link },
  ]},
  { label: "Reviews", items: [
    { label: "Requisition Review", href: "/admin/requisitions/review", icon: ClipboardCheck },
    { label: "Form Approvals", href: "/admin/forms/approvals", icon: FileText },
  ]},
  { label: "Management", items: [{ label: "Users", href: "/admin/users", icon: Users }, { label: "Roles", href: "/admin/roles", icon: UsersRound }, { label: "Departments", href: "/admin/departments", icon: Building2 }] },
  { label: "System", items: [{ label: "Audit Logs", href: "/admin/audit", icon: FileText }] },
];