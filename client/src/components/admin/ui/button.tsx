import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../../utils/admin/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hh-btn-anim",
  { variants: { variant: { default: "bg-blue-600 text-white hover:bg-blue-700", secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200", outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" }, size: { default: "h-10 px-4", sm: "h-9 px-3", lg: "h-11 px-5", icon: "h-10 w-10" } }, defaultVariants: { variant: "default", size: "default" } },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);