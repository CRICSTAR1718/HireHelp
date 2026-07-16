import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-white via-blue-50 to-slate-100 text-slate-900">
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-12 text-white">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold mb-6 text-white">HireHelp</h1>
                    <p className="text-lg leading-8 text-blue-50">
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
