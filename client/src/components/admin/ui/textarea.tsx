import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../../utils/admin/cn";

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70 resize-y",
      "transition-[border-color,box-shadow] duration-[175ms] ease-[var(--hh-ease)]",
      "focus:border-[var(--hh-accent)] focus:shadow-[0_0_0_3px_var(--hh-accent-soft)]",
      className,
    )}
    {...props}
  />
);
