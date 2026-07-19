import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/shared/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Calendar, LogOut, LayoutDashboard, FileText, Settings, Home, Clock, Bell, Link, Moon, Sun } from "lucide-react";

const navItems = [
  { to: "/interviewer", label: "Dashboard", icon: Home, end: true },
  { to: "/interviewer/interviews", label: "My Interviews", icon: Calendar },
  { to: "/interviewer/integrations", label: "Cal.com Setup", icon: Link },
];

export const InterviewerLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, effectiveTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <div className="scope-interviewer min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-slate-200 flex flex-col fixed h-full z-50">
        {/* Logo */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">HireHelp</h1>
              <p className="text-xs text-blue-100">AI Recruitment</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} strokeWidth={2} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
