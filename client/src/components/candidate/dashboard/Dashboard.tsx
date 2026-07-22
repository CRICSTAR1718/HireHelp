import { useEffect, useState } from "react";
import { ArrowUpRight, Briefcase, CheckCircle2, FileText, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentCard, SectionTitle, StatusBadge, LoadingState } from "../../../components/admin/common";
import { DashboardCard, StatsCard } from "../../../components/admin/dashboard";
import { getDashboard } from "../../../api/candidate/dashboard.api";
import { getApplications } from "../../../api/candidate/applications.api";
import { toUserMessage } from "../../../utils/toUserMessage";
import type { DashboardData } from "../../../types/candidate";
import type { Application } from "../../../types/candidate";

const quickActions = [
  { label: "Browse Jobs", href: "/candidate/jobs", icon: Briefcase },
  { label: "View Applications", href: "/candidate/applications", icon: FileText },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getDashboard(),
      getApplications()
    ])
      .then(([dashboardData, appsData]) => {
        setData(dashboardData);
        setApplications(appsData);
      })
      .catch((err) =>
        setError(toUserMessage(err, "Failed to load dashboard. Please try again."))
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error ?? "Failed to load dashboard"}
      </div>
    );
  }

  const activeApplications = applications.filter(app => app.status === "applied" || app.status === "shortlisted").length;
  const shortlisted = applications.filter(app => app.status === "shortlisted").length;
  const offers = applications.filter(app => app.status === "offer").length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <SectionTitle
          description="Overview of your job search activity and application status."
          title="Dashboard"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 hh-stagger">
          <div className="hh-stagger-item"><StatsCard description="Total job applications submitted" icon={Briefcase} label="Applications" tone="blue" value={String(applications.length)} /></div>
          <div className="hh-stagger-item"><StatsCard description="Currently in review" icon={Activity} label="Active Applications" tone="violet" value={String(activeApplications)} /></div>
          <div className="hh-stagger-item"><StatsCard description="Moved to interview stage" icon={CheckCircle2} label="Shortlisted" tone="emerald" value={String(shortlisted)} /></div>
          <div className="hh-stagger-item"><StatsCard description="Job offers received" icon={FileText} label="Offers" tone="amber" value={String(offers)} /></div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardCard title="Recent Applications">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
              <Briefcase className="h-5 w-5 text-slate-400" />
              <h2 className="mt-4 text-sm font-semibold text-slate-900">No applications yet</h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">Start browsing jobs and submit your first application.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{app.jobTitle}</p>
                    <p className="text-xs text-slate-500">{app.company}</p>
                  </div>
                  <StatusBadge label={app.status} tone={app.status === "shortlisted" ? "success" : app.status === "offer" ? "warning" : "neutral"} />
                </div>
              ))}
            </div>
          )}
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
        <ContentCard title="Activity Timeline">
          {data.activityTimeline && data.activityTimeline.length > 0 ? (
            <div className="space-y-4">
              {data.activityTimeline.map((item, index) => (
                <div className="flex gap-3" key={index}>
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">No recent activity</p>
            </div>
          )}
        </ContentCard>
      </section>
    </div>
  );
}
