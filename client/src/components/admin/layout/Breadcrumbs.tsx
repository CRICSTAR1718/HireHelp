import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const adminLabels: Record<string, string> = { admin: "Dashboard", users: "Users", roles: "Roles", permissions: "Permissions", departments: "Departments", configuration: "Configuration", audit: "Audit Logs", approvals: "Approvals" };
const candidateLabels: Record<string, string> = { candidate: "Dashboard", profile: "Profile", jobs: "Jobs", applications: "Applications", settings: "Settings" };

interface BreadcrumbsProps { basePath?: string; userType?: string; }

export const Breadcrumbs = ({ basePath = "/admin", userType = "Admin" }: BreadcrumbsProps) => {
  const labels = userType === "Candidate" ? candidateLabels : adminLabels;
  const segments = useLocation().pathname.split("/").filter(Boolean);
  
  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-sm text-slate-500 md:flex">
      <Link aria-label="Dashboard" className="rounded p-1 hover:bg-slate-100 hover:text-slate-900" to={basePath}>
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => (
        <span className="flex items-center gap-1" key={`${segment}-${index}`}>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className={index === segments.length - 1 ? "font-medium text-slate-700" : ""}>
            {labels[segment] ?? segment}
          </span>
        </span>
      ))}
    </nav>
  );
};