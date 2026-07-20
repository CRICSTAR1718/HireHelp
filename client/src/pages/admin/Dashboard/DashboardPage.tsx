import { Activity, ArrowUpRight, Building2, CheckCircle2, ClipboardCheck, FileText, ShieldCheck, Users, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentCard, SectionTitle, StatusBadge } from "../../../components/admin/common";
import { DashboardCard, StatsCard } from "../../../components/admin/dashboard";
import { useAuth } from "../../../hooks/shared/useAuth";
import { useDashboardStats } from "../../../hooks/admin/queries";

const activityItems = ["Role policy was updated", "New department request received", "User access review completed"];
const quickActions = [
  { label: "Manage users", href: "/admin/users", icon: Users },
  { label: "Schedule interview", href: "/admin/schedule-interview", icon: Activity },
  { label: "Review approvals", href: "/admin/approvals", icon: ClipboardCheck },
  { label: "Review requisitions", href: "/admin/requisitions/review", icon: FileText },
  { label: "Review form approvals", href: "/admin/forms/approvals", icon: ClipboardCheck },
  { label: "Platform settings", href: "/admin/configuration", icon: ShieldCheck },
];

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
      <section>
        <SectionTitle
          description="Overview of platform metrics and management modules."
          title="Platform overview"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard description="Across the organization" icon={Users} label="Total Users" tone="blue" value={isLoading ? "—" : stats?.totalUsers?.toString() || "0"} />
          <StatsCard description="Configured access roles" icon={UsersRound} label="Total Roles" tone="violet" value={isLoading ? "—" : stats?.totalRoles?.toString() || "0"} />
          <StatsCard description="Active organizational units" icon={Building2} label="Departments" tone="emerald" value={isLoading ? "—" : stats?.totalDepartments?.toString() || "0"} />
          <StatsCard description="Awaiting a decision" icon={ClipboardCheck} label="Pending Approvals" tone="amber" value={isLoading ? "—" : stats?.pendingApprovals?.toString() || "0"} />
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <DashboardCard title="Recent Activity">
          <div className="space-y-4">
            {activityItems.map((item, index) => (
              <div className="flex gap-3" key={item}>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                  <p className="mt-1 text-xs text-slate-400">Activity placeholder {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Quick Actions">
          <div className="space-y-2">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                key={href}
                to={href}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <ContentCard title="Recent Audit">
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5">
            <FileText className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700">Audit activity will appear here</p>
              <p className="mt-1 text-sm text-slate-500">This panel is ready for the audit module integration.</p>
            </div>
          </div>
        </ContentCard>

        <ContentCard title="Pending Approvals">
          <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">Approval queue will appear here</p>
                <p className="mt-1 text-sm text-slate-500">No approval data has been loaded in this foundation.</p>
              </div>
            </div>
            <StatusBadge label="Placeholder" tone="info" />
          </div>
        </ContentCard>
      </section>
    </div>
  );
};
