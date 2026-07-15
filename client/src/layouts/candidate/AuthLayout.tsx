import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100">
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-12">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold mb-6 text-white">HireHelp</h1>
                    <p className="text-lg leading-8 text-slate-300">
                        Find your dream job, manage your applications, track interviews,
                        and build your professional profile.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
