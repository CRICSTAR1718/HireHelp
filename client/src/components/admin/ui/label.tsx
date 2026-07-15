import type { LabelHTMLAttributes } from "react";
import { cn } from "../../../utils/admin/cn";

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("block text-sm font-medium text-slate-700", className)} {...props} />
);
