import { Outlet } from "react-router-dom";
import Sidebar from "../../components/candidate/dashboard/Sidebar";
import Header from "../../components/candidate/dashboard/Header";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <div className="flex h-screen overflow-hidden">

                {/* Sidebar */}
                <aside className="hidden lg:flex w-72 shrink-0 border-r border-slate-800/50 bg-slate-900/95 backdrop-blur-xl">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">

                    {/* Header */}
                    <header className="sticky top-0 z-30 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl shadow-lg">
                        <Header />
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
                            <Outlet />
                        </div>
                    </main>

                </div>

            </div>
        </div>
    );
}