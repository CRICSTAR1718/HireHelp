import { ChevronLeft, ChevronRight, LogOut, Settings, ShieldCheck, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigationGroups as adminNavigationGroups } from "../../../constants/admin/navigation";
import { useAuth } from "../../../hooks/shared/useAuth";
import { cn } from "../../../utils/admin/cn";
import type { NavigationGroup } from "../../../types/admin/navigation";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggle: () => void;
  navigationGroups?: NavigationGroup[];
  user?: any;
  userType?: string;
}

export const Sidebar = ({ collapsed, mobileOpen, onCloseMobile, onToggle, navigationGroups: customNavigationGroups, user: customUser, userType = "Admin" }: SidebarProps) => {
  const { user: authUser, logout } = useAuth();
  const user = customUser || authUser;
  const navigationGroups = customNavigationGroups || adminNavigationGroups;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
        role="presentation"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-700 bg-slate-900 transition-all duration-200",
          collapsed ? "w-0 overflow-hidden" : "w-64",
          "lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-700 px-4">
          <NavLink className="flex min-w-0 items-center gap-3" onClick={onCloseMobile} to={userType === "Candidate" ? "/candidate/dashboard" : "/admin"}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            {!collapsed && <span className="truncate text-sm font-semibold text-white">HireHelp {userType}</span>}
          </NavLink>
          <button
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            onClick={onCloseMobile}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navigationGroups.map((group) => (
            <div className="mb-6" key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map(({ label, href, icon: Icon }) => (
                  <NavLink
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white",
                        collapsed && "justify-center px-2",
                      )
                    }
                    key={href}
                    onClick={onCloseMobile}
                    title={collapsed ? label : undefined}
                    to={href}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-700 p-3">
          <div className={cn("mb-2 flex items-center gap-3 px-2 py-2", collapsed && "justify-center")}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-semibold text-slate-300">
              {`${user?.firstName?.charAt(0) ?? "S"}${user?.lastName?.charAt(0) ?? "A"}`}
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-slate-400">{userType}</p>
              </div>
            )}
          </div>

          {userType !== "Admin" && userType !== "Candidate" && (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  collapsed && "justify-center px-2",
                )
              }
              onClick={onCloseMobile}
              title={collapsed ? "Settings" : undefined}
              to={userType === "Candidate" ? "/candidate/settings" : "/recruiter/settings"}
            >
              <Settings className="h-5 w-5" />
              {!collapsed && "Settings"}
            </NavLink>
          )}

          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-900/20",
              collapsed && "justify-center px-2",
            )}
            onClick={() => {
              void logout();
            }}
            title={collapsed ? "Sign out" : undefined}
            type="button"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && "Sign out"}
          </button>

          <button
            aria-label="Toggle sidebar"
            className="mt-2 w-full items-center justify-center rounded-lg py-2 text-slate-400 hover:bg-slate-800 lg:flex"
            onClick={onToggle}
            type="button"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};
