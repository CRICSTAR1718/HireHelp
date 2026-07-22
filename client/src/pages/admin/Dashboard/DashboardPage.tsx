import { Activity, ArrowUpRight, Building2, CheckCircle2, ClipboardCheck, FileText, ShieldCheck, Users, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentCard, SectionTitle, StatusBadge } from "../../../components/admin/common";
import { DashboardCard, StatsCard } from "../../../components/admin/dashboard";
import { useAuth } from "../../../hooks/shared/useAuth";
import { useDashboardStats } from "../../../hooks/admin/queries";

const quickActions = [
  { label: "Manage users", href: "/admin/users", icon: Users },
  { label: "Review applications", href: "/admin/applications", icon: ClipboardCheck },
  { label: "Schedule interview", href: "/admin/schedule-interview", icon: Activity },
  { label: "Review approvals", href: "/admin/approvals", icon: ClipboardCheck },
  { label: "Review requisitions", href: "/admin/requisitions/review", icon: FileText },
  { label: "Review form approvals", href: "/admin/forms/approvals", icon: ClipboardCheck },
];

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
      <section>
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Overview of platform metrics and management modules.</p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 hh-stagger">
          <div className="hh-stagger-item p-6"><StatsCard description="Across the organization" icon={Users} label="Total Users" tone="blue" value={isLoading ? "—" : stats?.totalUsers?.toString() || "0"} /></div>
          <div className="hh-stagger-item p-6"><StatsCard description="Configured access roles" icon={UsersRound} label="Total Roles" tone="violet" value={isLoading ? "—" : stats?.totalRoles?.toString() || "0"} /></div>
          <div className="hh-stagger-item p-6"><StatsCard description="Active organizational units" icon={Building2} label="Departments" tone="emerald" value={isLoading ? "—" : stats?.totalDepartments?.toString() || "0"} /></div>
          <div className="hh-stagger-item p-6"><StatsCard description="Awaiting a decision" icon={ClipboardCheck} label="Pending Approvals" tone="amber" value={isLoading ? "—" : stats?.pendingApprovals?.toString() || "0"} /></div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-lg text-gray-600">Quick actions for common administrative tasks.</p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="flex items-center gap-4 rounded-lg border border-slate-200 p-6 text-base font-medium text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
            >
              <Icon className="h-6 w-6 text-blue-600" />
              <span>{label}</span>
              <ArrowUpRight className="ml-auto h-5 w-5 text-slate-400" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
