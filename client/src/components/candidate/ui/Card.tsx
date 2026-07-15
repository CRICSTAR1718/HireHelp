import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({
    children,
    className = "",
}: CardProps) {
    return (
        <div
            className={`
                rounded-3xl
                border
                border-slate-800
                bg-slate-900
                p-6
                shadow-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/40
                hover:shadow-blue-500/10
                ${className}
            `}
        >
            {children}
        </div>
    );
}