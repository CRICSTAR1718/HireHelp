import { Outlet } from "react-router-dom";
import Sidebar from "../../components/candidate/dashboard/Sidebar";
import Header from "../../components/candidate/dashboard/Header";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 text-slate-900">
            <div className="flex h-screen overflow-hidden">

                {/* Sidebar */}
                <aside className="hidden lg:flex w-72 shrink-0 border-r border-blue-100 bg-white/95 backdrop-blur-xl shadow-[8px_0_30px_rgba(37,99,235,0.06)]">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">

                    {/* Header */}
                    <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/90 backdrop-blur-xl shadow-sm">
                        <Header />
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                            <Outlet />
                        </div>
                    </main>

                </div>

            </div>
        </div>
    );
}