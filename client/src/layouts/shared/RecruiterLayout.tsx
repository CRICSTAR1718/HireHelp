import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/shared/useAuth";
import { Briefcase, Plus, GitPullRequest, Users, Star, Calendar, BarChart2, FileText, Bell, Settings, LogOut, LayoutDashboard, ChevronDown, ChevronRight, Home, Link, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { PageTransition } from "@/components/shared/PageTransition";

const navItems = [
  { to: "/recruiter/dashboard", label: "Dashboard", icon: Home, end: true },
  { 
    to: "/recruiter/requisitions", 
    label: "Requisitions", 
    icon: Briefcase, 
    subItems: [
      { to: "/recruiter/requisitions", label: "All Requisitions", icon: Briefcase },
      { to: "/recruiter/requisitions/new", label: "Create Requisition", icon: Plus },
    ]
  },
  { to: "/recruiter/pipeline", label: "Pipeline", icon: GitPullRequest },
  { to: "/recruiter/candidates", label: "Candidates", icon: Users },
  { to: "/recruiter/talent-pool", label: "Talent Pool", icon: Star },
  { 
    to: "/recruiter/interviews", 
    label: "Interviews", 
    icon: Calendar,
    subItems: [
      { to: "/recruiter/interviews", label: "My Interviews", icon: Calendar },
      { to: "/recruiter/interviews/all", label: "All Interviews", icon: Users },
    ]
  },
  { to: "/recruiter/schedule-interview", label: "Schedule Interview", icon: Plus },
  { to: "/recruiter/integrations", label: "Cal.com Setup", icon: Link },
];

export const RecruiterLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleExpanded = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <div className="scope-recruiter relative min-h-screen flex">
      <AnimatedBackground />
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 shadow-lg border-r flex flex-col fixed h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 -translate-x-full opacity-0 pointer-events-none' : 'w-64 translate-x-0 opacity-100'
        }`}
        style={{ borderColor: 'var(--border)', zIndex: 9999 }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-700 flex items-center bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-white">HireHelp</h1>
                <p className="text-xs text-blue-100">AI Recruitment</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = 'subItems' in item;
              
              if (hasSubItems) {
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 !text-white"
                            : "!text-slate-300 hover:bg-slate-800 hover:!text-white"
                        }`
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        !sidebarCollapsed && toggleExpanded(item.label);
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? '!text-white' : '!text-slate-500'}`} strokeWidth={2} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                          </div>
                          {!sidebarCollapsed && (expandedItem === item.label ? (
                            <ChevronDown className={`w-4 h-4 ${isActive ? '!text-white' : '!text-slate-500'}`} strokeWidth={2} />
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${isActive ? '!text-white' : '!text-slate-500'}`} strokeWidth={2} />
                          ))}
                        </>
                      )}
                    </NavLink>
                    {expandedItem === item.label && item.subItems && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <li key={subItem.to}>
                              <NavLink
                                to={subItem.to}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                                    isActive
                                      ? "bg-blue-600 !text-white"
                                      : "!text-slate-300 hover:bg-slate-800 hover:!text-white"
                                  }`
                                }
                              >
                                {({ isActive }) => (
                                  <>
                                    <SubIcon className={`w-4 h-4 ${isActive ? '!text-white' : '!text-slate-500'}`} strokeWidth={2} />
                                    <span className="text-sm">{subItem.label}</span>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 !text-white"
                          : "!text-slate-300 hover:bg-slate-800 hover:!text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? '!text-white' : '!text-slate-500'}`} strokeWidth={2} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-700 bg-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`relative z-10 flex-1 p-6 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : 'ml-64'
      }`} style={{ borderColor: 'var(--border)' }}>
        {/* Hamburger menu button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="max-w-7xl mx-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
};
