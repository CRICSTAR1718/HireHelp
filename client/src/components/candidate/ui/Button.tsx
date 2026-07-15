import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
    loading?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    fullWidth = false,
    loading = false,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={clsx(
                "rounded-xl px-5 py-3 font-semibold transition-all duration-300",

                variant === "primary" &&
                "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]",

                variant === "secondary" &&
                "bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600/50 hover:border-slate-500/50",

                variant === "danger" &&
                "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02]",

                fullWidth && "w-full",

                className
            )}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}

