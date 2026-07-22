import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-(--hh-surface-soft) px-5 py-10 text-center hh-fade-in" style={{ borderColor: "var(--hh-border)" }}>
    {Icon && (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: "var(--hh-accent-soft)",
          color: "var(--hh-accent)",
        }}
      >
        <Icon className="h-6 w-6" />
      </div>
    )}

    <h2 className="mt-4 text-sm font-semibold" style={{ color: "var(--hh-text)" }}>
      {title}
    </h2>

    <p className="mt-1 max-w-sm text-sm" style={{ color: "var(--hh-text-secondary)" }}>
      {description}
    </p>

    {action && <div className="mt-4">{action}</div>}
  </div>
);