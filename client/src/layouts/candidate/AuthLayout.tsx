import { Outlet } from "react-router-dom";
import { Users, FileText, ShieldCheck, Award, Lock } from "lucide-react";

const steps = [
    {
        icon: FileText,
        title: "Explore Opportunities",
        text: "Discover roles that match your skills and career goals.",
    },
    {
        icon: ShieldCheck,
        title: "Screening",
        text: "We review your application to ensure a great match.",
    },
    {
        icon: Users,
        title: "Interview",
        text: "Connect with our team and share your potential.",
    },
    {
        icon: Award,
        title: "Offer",
        text: "Receive your offer and take the next step in your career.",
    },
];

export default function AuthLayout() {
    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-[1.05fr_1fr] bg-[#1A2338] text-white lg:bg-white lg:text-[#0B1220]">
            {/* Left: brand / journey panel */}
            <div className="hidden lg:flex relative flex-col justify-center overflow-hidden bg-[#1A2338] px-14 py-10 text-white xl:px-20">
                {/* checker grid */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* ambient glow */}
                <div className="pointer-events-none absolute -top-40 -right-32 h-[24rem] w-[24rem] rounded-full bg-[#4F46E5] opacity-30 blur-[110px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#34D8B9] opacity-20 blur-[100px]" />

                <div className="relative z-10 mx-auto w-full max-w-md">
                    {/* logo */}
                    <div className="mb-7 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5]">
                            <Users className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                        </div>
                        <span className="text-[14px] font-bold tracking-tight">
                            Hire<span className="text-[#d7d9e0]">Help</span>
                        </span>
                    </div>

                    {/* headline */}
                    {/* headline */}
                        <h1 className="text-[1.85rem] font-extrabold leading-[1.15] tracking-tight">
                            <span className="text-white">Your Journey,</span>
                            <br />
                            <span className="text-[#A5B4FC]">Our Priority.</span>
                        </h1>
                    <div className="mt-3.5 mb-3.5 h-1 w-8 rounded-full bg-[#4F46E5]" />
                    <p className="max-w-sm text-[12.5px] leading-5 text-white/90">
                        Apply to opportunities, track your progress, and take the
                        next step in your career with confidence.
                    </p>

                    {/* steps */}
                    <div className="mt-7 space-y-3.5">
                        {steps.map(({ icon: Icon, title, text }) => (
                            <div key={title} className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                                    <Icon className="h-3.5 w-3.5 text-[#A5B4FC]" strokeWidth={1.9} />
                                </div>
                                <div>
                                    <div className="text-[12.5px] font-semibold text-white">
                                        {title}
                                    </div>
                                    <p className="mt-0.5 text-[11px] leading-4 text-white/85">
                                        {text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* trust footer card */}
                    <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                            <Lock className="h-3.5 w-3.5 text-[#5EEAD4]" strokeWidth={1.9} />
                        </div>
                        <div>
                            <div className="text-[12px] font-semibold text-white">
                                Your data is safe with us
                            </div>
                            <p className="mt-0.5 text-[11px] leading-4 text-white/85">
                                We use enterprise-grade security to protect your
                                information and privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: form panel */}
            <div className="flex items-center justify-center bg-white p-6 sm:p-8 overflow-y-auto">
                <div className="w-full max-w-[380px] text-[#0B1220]">
                    {/* mobile-only logo */}
                    <div className="mb-6 flex items-center gap-2 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
                            <Users className="h-4 w-4 text-white" strokeWidth={2} />
                        </div>
                        <span className="text-[16px] font-bold tracking-tight">
                            Hire<span className="text-[#818CF8]">HireHelp</span>
                        </span>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
}