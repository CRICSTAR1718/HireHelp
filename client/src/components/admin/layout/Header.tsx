import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProfileDropdown } from "./ProfileDropdown";

const adminTitles: Record<string, string> = { "/admin": "Dashboard", "/admin/users": "Users", "/admin/roles": "Roles", "/admin/permissions": "Permissions", "/admin/departments": "Departments", "/admin/configuration": "Configuration", "/admin/audit": "Audit Logs", "/admin/approvals": "Approvals" };
const candidateTitles: Record<string, string> = { "/candidate/dashboard": "Dashboard", "/candidate/profile": "Profile", "/candidate/jobs": "Jobs", "/candidate/applications": "Applications", "/candidate/settings": "Settings" };

interface HeaderProps { onMenuClick: () => void; onDesktopMenuClick: () => void; userType?: string; }

export const Header = ({ onMenuClick, onDesktopMenuClick, userType = "Admin" }: HeaderProps) => {
  const titles = userType === "Candidate" ? candidateTitles : adminTitles;
  const basePath = userType === "Candidate" ? "/candidate" : "/admin";
  const title = titles[useLocation().pathname] ?? `HireHelp ${userType}`;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button aria-label="Toggle navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} type="button">
        <Menu className="h-5 w-5" />
      </button>
      <button aria-label="Toggle sidebar" className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:block" onClick={onDesktopMenuClick} type="button">
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
};