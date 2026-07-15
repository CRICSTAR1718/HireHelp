import { Activity, ArrowUpRight, Building2, CheckCircle2, ClipboardCheck, FileText, ShieldCheck, Users, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentCard, SectionTitle, StatusBadge } from "../../../components/admin/common";
import { DashboardCard, StatsCard } from "../../../components/admin/dashboard";
import { useAuth } from "../../../hooks/shared/useAuth";

const activityItems = ["Role policy was updated", "New department request received", "User access review completed"];
const quickActions = [
  { label: "Manage users", href: "/admin/users", icon: Users },
  { label: "Review approvals", href: "/admin/approvals", icon: ClipboardCheck },
  { label: "Review requisitions", href: "/recruiter/admin/requisitions", icon: FileText },
  { label: "Review form approvals", href: "/recruiter/admin/form-approvals", icon: ClipboardCheck },
  { label: "Platform settings", href: "/admin/configuration", icon: ShieldCheck },
];

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden rounded-xl border border-blue-100 bg-blue-600 px-6 py-7 text-white shadow-sm sm:px-8">
        <p className="text-sm font-medium text-blue-100">HireHelp Admin Portal</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {user?.firstName ?? "Admin"}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
          Monitor platform operations, manage administrative resources, and keep the recruitment workflow moving.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
            to="/recruiter/admin/requisitions"
          >
            <FileText className="h-4 w-4" />
            Requisition Review
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            to="/recruiter/admin/form-approvals"
          >
            <ClipboardCheck className="h-4 w-4" />
            Form Approvals
          </Link>
        </div>
      </section>

      <section>
        <SectionTitle
          description="Overview placeholders for the management modules that will be connected in later milestones."
          title="Platform overview"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard description="Across the organization" icon={Users} label="Total Users" tone="blue" value="—" />
          <StatsCard description="Configured access roles" icon={UsersRound} label="Total Roles" tone="violet" value="—" />
          <StatsCard description="Active organizational units" icon={Building2} label="Departments" tone="emerald" value="—" />
          <StatsCard description="Awaiting a decision" icon={ClipboardCheck} label="Pending Approvals" tone="amber" value="—" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <DashboardCard title="System Health">
          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Service status</p>
              <p className="text-sm text-emerald-700">Health indicators will appear here.</p>
            </div>
          </div>
        </DashboardCard>

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

      <section className="grid gap-6 xl:grid-cols-2">
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
