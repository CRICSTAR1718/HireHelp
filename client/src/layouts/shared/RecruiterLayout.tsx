import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/shared/useAuth";
import { Briefcase, Plus, GitPullRequest, Users, Star, Calendar, BarChart2, FileText, Bell, Settings, LogOut, LayoutDashboard, ChevronDown, ChevronRight, Home, Link, Menu, X } from "lucide-react";
import { useState } from "react";

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
    <div className="scope-recruiter min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg border-r flex flex-col fixed h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'w-0 -translate-x-full' : 'w-64 translate-x-0'
        }`}
        style={{ borderColor: 'var(--border)', zIndex: 9999 }}
      >
        {/* Logo */}
        <div className="p-5 border-b flex items-center" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, var(--accent), #6366f1)' }}>
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
                        `flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          isActive
                            ? "text-white shadow-md"
                            : ""
                        }`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                        color: isActive ? 'white' : 'var(--text-secondary)'
                      })}
                      onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                      onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('text-white')) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                      onClick={() => !sidebarCollapsed && toggleExpanded(item.label)}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 flex-shrink-0`} style={{ color: isActive ? 'white' : 'var(--text-muted)' }} strokeWidth={2} />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                          </div>
                          {!sidebarCollapsed && (expandedItem === item.label ? (
                            <ChevronDown className="w-4 h-4" style={{ color: isActive ? 'white' : 'var(--text-muted)' }} strokeWidth={2} />
                          ) : (
                            <ChevronRight className="w-4 h-4" style={{ color: isActive ? 'white' : 'var(--text-muted)' }} strokeWidth={2} />
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
                                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    isActive
                                      ? "text-white shadow-md"
                                      : ""
                                  }`
                                }
                                style={({ isActive }) => ({
                                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                                  color: isActive ? 'white' : 'var(--text-secondary)'
                                })}
                                onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                                onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('text-white')) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                              >
                                {({ isActive }) => (
                                  <>
                                    <SubIcon className={`w-4 h-4`} style={{ color: isActive ? 'white' : 'var(--text-muted)' }} strokeWidth={2} />
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
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "text-white shadow-md"
                          : ""
                      }`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? 'white' : 'var(--text-secondary)'
                    })}
                    onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                    onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('text-white')) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 flex-shrink-0`} style={{ color: isActive ? 'white' : 'var(--text-muted)' }} strokeWidth={2} />
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
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 group"
            style={{ color: 'var(--danger)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--danger)'; }}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-6 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : 'ml-64'
      }`} style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}>
        {/* Hamburger menu button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)' }}
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
