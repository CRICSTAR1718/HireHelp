import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { SearchInput } from "../common/SearchInput";
import { ProfileDropdown } from "./ProfileDropdown";

const titles: Record<string, string> = { "/admin": "Dashboard", "/admin/users": "Users", "/admin/roles": "Roles", "/admin/permissions": "Permissions", "/admin/departments": "Departments", "/admin/configuration": "Configuration", "/admin/audit": "Audit Logs", "/admin/approvals": "Approvals" };
interface HeaderProps { onMenuClick: () => void; }
export const Header = ({ onMenuClick }: HeaderProps) => {
  const title = titles[useLocation().pathname] ?? "HireHelp Admin";
  return <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6"><button aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} type="button"><Menu className="h-5 w-5" /></button><div className="md:hidden"><p className="text-sm font-semibold text-slate-900">{title}</p></div><div className="hidden md:block"><Breadcrumbs /></div><div className="hidden flex-1 md:block"><SearchInput /></div><div className="ml-auto flex items-center gap-2"><button aria-label="Notifications" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" type="button"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" /></button><ProfileDropdown /></div></header>;
};