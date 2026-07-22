import type { HTMLAttributes } from "react";
import { cn } from "../../../utils/admin/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white shadow-sm hh-lift", className)} {...props} />
);