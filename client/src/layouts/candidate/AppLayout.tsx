import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../../components/admin/layout";
import { navigationGroups } from "../../constants/candidate/navigation";
import { useAuth } from "../../hooks/candidate/useAuth";

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { auth } = useAuth();

  return (
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
      <div className="min-w-0 flex-1">
        <Header 
          onMenuClick={() => setMobileOpen(true)} 
          userType="Candidate"
        />
        <main className="min-h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
