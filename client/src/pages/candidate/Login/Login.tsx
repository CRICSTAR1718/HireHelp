import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";

export default function Login() {
    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl shadow-slate-200/40 sm:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.32em] text-blue-600">Welcome back</p>
                    <h1 className="text-4xl font-bold text-slate-900">Sign in to HireHelp</h1>
                    <p className="max-w-xl text-slate-600">
                        Access your dashboard, manage applications, and track interviews in one beautiful place.
                    </p>
                </div>

                <LoginForm />

                <div className="flex justify-between text-sm text-slate-600">
                    <Link to="/candidate/forgot-password" className="text-blue-600 hover:text-blue-700">
                        Forgot password?
                    </Link>
                    <Link to="/candidate/register" className="text-blue-600 hover:text-blue-700">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}
