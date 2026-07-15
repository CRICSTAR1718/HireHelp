import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/interviewer", label: "My Interviews", icon: "📋", end: true },
  { to: "/interviewer/schedule", label: "Schedule", icon: "📅" },
  { to: "/interviewer/feedback", label: "Feedback", icon: "✍️" },
  { to: "/interviewer/calendar", label: "Integrations", icon: "🔗" },
  { to: "/interviewer/history", label: "History", icon: "📊" },
];

export const InterviewerLayout = () => {
  return (
    <div className="scope-interviewer min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold text-gray-900">HireHelp Interview</span>
            </div>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
