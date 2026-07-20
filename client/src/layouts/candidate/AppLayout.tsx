import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Sidebar } from "../../components/admin/layout";
import { navigationGroups } from "../../constants/candidate/navigation";
import { useAuth } from "../../hooks/candidate/useAuth";

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { auth } = useAuth();

  return (
    <>
      {/* Persistent sidebar toggle — always visible on desktop, outside scope-candidate */}
      <button
        aria-label="Toggle sidebar"
        onClick={() => setCollapsed((v) => !v)}
        style={{ color: "#1e293b" }}
        className={`
          fixed top-4 z-[9999] hidden lg:flex
          items-center justify-center
          h-7 w-7 rounded-full border border-slate-300
          bg-white shadow-md
          hover:bg-slate-100
          transition-all duration-200
          ${collapsed ? "left-2" : "left-[252px]"}
        `}
        type="button"
      >
        {collapsed
          ? <ChevronRight className="h-4 w-4" style={{ color: "#1e293b" }} />
          : <ChevronLeft className="h-4 w-4" style={{ color: "#1e293b" }} />}
      </button>

      {/* Mobile hamburger — always visible on small screens */}
      <button
        aria-label="Open navigation"
        onClick={() => setMobileOpen((v) => !v)}
        style={{ color: "#1e293b" }}
        className="fixed top-3 left-3 z-[9999] flex lg:hidden items-center justify-center h-9 w-9 rounded-lg border border-slate-300 bg-white shadow"
        type="button"
      >
        <Menu className="h-5 w-5" style={{ color: "#1e293b" }} />
      </button>

      <div className="scope-candidate flex min-h-screen bg-slate-50">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggle={() => setCollapsed((value) => !value)}
          navigationGroups={navigationGroups}
          user={auth.user}
          userType="Candidate"
        />
        <div className="min-w-0 flex-1 transition-all duration-200">
          <main className="min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
