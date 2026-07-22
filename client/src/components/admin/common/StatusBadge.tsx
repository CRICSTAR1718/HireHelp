import { cn } from "../../../utils/admin/cn";

type StatusTone = "success" | "warning" | "neutral" | "info" | "danger";
interface StatusBadgeProps { label: string; tone?: StatusTone; }

const tones: Record<StatusTone, string> = { 
  success: "bg-[var(--hh-success-soft)] text-[var(--hh-success)] ring-[var(--hh-success)]/20", 
  warning: "bg-[var(--hh-warning-soft)] text-[var(--hh-warning)] ring-[var(--hh-warning)]/20", 
  neutral: "bg-[var(--hh-info-soft)] text-[var(--hh-info)] ring-[var(--hh-info)]/20", 
  info: "bg-[var(--hh-info-soft)] text-[var(--hh-info)] ring-[var(--hh-info)]/20",
  danger: "bg-[var(--hh-danger-soft)] text-[var(--hh-danger)] ring-[var(--hh-danger)]/20"
};

export const StatusBadge = ({ label, tone = "neutral" }: StatusBadgeProps) => (
  <span 
    className={cn(
      "inline-flex items-center px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
      tones[tone]
    )}
    style={{ borderRadius: 'var(--hh-radius-pill)' }}
  >
    {label}
  </span>
);