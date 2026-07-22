import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../../components/admin/layout";
import { AnimatedBackground } from "../../components/shared/AnimatedBackground";
import { PageTransition } from "../../components/shared/PageTransition";

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="scope-admin relative flex min-h-screen bg-slate-50"><AnimatedBackground /><Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} onToggle={() => setCollapsed((value) => !value)} /><div className="min-w-0 flex-1"><Header onMenuClick={() => setMobileOpen((value) => !value)} onDesktopMenuClick={() => setCollapsed((value) => !value)} /><main className="min-h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-8"><PageTransition><Outlet /></PageTransition></main></div></div>;
};