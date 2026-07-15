import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/admin/cn";

interface StatsCardProps { label: string; value: string; description: string; icon: LucideIcon; tone?: "blue" | "violet" | "emerald" | "amber"; }
const tones = { blue: "bg-blue-50 text-blue-600", violet: "bg-violet-50 text-violet-600", emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600" };
export const StatsCard = ({ label, value, description, icon: Icon, tone = "blue" }: StatsCardProps) => <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className={cn("rounded-lg p-2", tones[tone])}><Icon className="h-5 w-5" /></span></div><p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-sm text-slate-500">{description}</p></article>;