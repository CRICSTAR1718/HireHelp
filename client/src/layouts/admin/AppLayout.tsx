import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../../components/admin/layout";

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="scope-admin flex min-h-screen bg-slate-50"><Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} onToggle={() => setCollapsed((value) => !value)} /><div className={`min-w-0 flex-1 transition-all duration-200 ${collapsed ? 'ml-0' : 'ml-64'}`}><Header onMenuClick={() => setCollapsed((value) => !value)} /><main className="min-h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-8"><Outlet /></main></div></div>;
};