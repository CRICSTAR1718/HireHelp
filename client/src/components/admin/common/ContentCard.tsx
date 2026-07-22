import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "../../../utils/admin/cn";

interface ContentCardProps extends PropsWithChildren { className?: string; title?: string; action?: ReactNode; }

export const ContentCard = ({ children, className, title, action }: ContentCardProps) => (
  <section className={cn("rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 hh-lift", className)}>
    {(title || action) && <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-base font-semibold text-slate-900">{title}</h2>{action}</div>}
    {children}
  </section>
);