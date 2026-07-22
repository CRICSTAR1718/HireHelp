import { Outlet } from "react-router-dom";
import { Users, LineChart, ShieldCheck } from "lucide-react";

export default function AuthLayout() {
    return (
        <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-[#F6F7F9] text-[#0B1220]">
            {/* Left: brand panel */}
            <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-[#0B1220] p-14 text-white">
                {/* ambient grid */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }}
                />
                {/* glow */}
                <div className="pointer-events-none absolute -top-40 -right-32 h-[26rem] w-[26rem] rounded-full bg-[#4F46E5] opacity-30 blur-[110px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#34D8B9] opacity-20 blur-[100px]" />

                {/* logo */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] font-mono text-sm font-bold">
                        H
                    </div>
                    <span className="text-[15px] font-semibold tracking-tight">HireHelp</span>
                </div>

                {/* headline */}
                <div className="relative z-10 max-w-md">
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#34D8B9]">
                        Hiring, streamlined
                    </p>
                    <h1 className="mb-6 text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-white">
                        Every candidate,
                        <br />
                        one clear pipeline.
                    </h1>
                    <p className="text-[15px] leading-7 text-slate-400">
                        Track applications, schedule interviews, and evaluate talent
                        without the spreadsheet chaos.
                    </p>

                    <div className="mt-10 space-y-5">
                        {[
                            { icon: Users, text: "Unified candidate profiles across every role" },
                            { icon: LineChart, text: "Live pipeline stats, no manual tracking" },
                            { icon: ShieldCheck, text: "Structured, bias-aware screening" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5">
                                    <Icon className="h-4 w-4 text-[#34D8B9]" strokeWidth={1.75} />
                                </div>
                                <span className="text-[14px] text-slate-300">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* footer stat strip */}
                <div className="relative z-10 flex items-center gap-8 border-t border-white/10 pt-6">
                    <div>
                        <div className="font-mono text-xl font-semibold text-white">12k+</div>
                        <div className="text-xs text-slate-500">candidates tracked</div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                        <div className="font-mono text-xl font-semibold text-white">340+</div>
                        <div className="text-xs text-slate-500">teams hiring</div>
                    </div>
                </div>
            </div>

            {/* Right: form panel */}
            <div className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-[400px]">
                    {/* mobile-only logo */}
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1220] font-mono text-sm font-bold text-white">
                            H
                        </div>
                        <span className="text-[15px] font-semibold tracking-tight">HireHelp</span>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
}