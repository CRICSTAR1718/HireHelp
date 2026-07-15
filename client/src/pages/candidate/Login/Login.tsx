import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";

export default function Login() {
    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-10 shadow-2xl shadow-slate-950/40 sm:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
            <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.32em] text-blue-400">Welcome back</p>
                    <h1 className="text-4xl font-bold text-white">Sign in to HireHelp</h1>
                    <p className="max-w-xl text-slate-400">
                        Access your dashboard, manage applications, and track interviews in one beautiful place.
                    </p>
                </div>

                <LoginForm />

                <p className="text-center text-slate-400">
                    Don’t have an account?{' '}
                    <Link to="/candidate/register" className="text-blue-400 hover:text-blue-300">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
