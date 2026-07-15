import { cn } from "../../../utils/admin/cn";

type StatusTone = "success" | "warning" | "neutral" | "info";
interface StatusBadgeProps { label: string; tone?: StatusTone; }

const tones: Record<StatusTone, string> = { success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", warning: "bg-amber-50 text-amber-700 ring-amber-600/20", neutral: "bg-slate-100 text-slate-600 ring-slate-500/20", info: "bg-blue-50 text-blue-700 ring-blue-600/20" };
export const StatusBadge = ({ label, tone = "neutral" }: StatusBadgeProps) => <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", tones[tone])}>{label}</span>;