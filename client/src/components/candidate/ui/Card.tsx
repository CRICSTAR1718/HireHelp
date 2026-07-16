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
                border-blue-100
                bg-white
                p-6
                shadow-[0_12px_30px_rgba(37,99,235,0.08)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-[0_18px_40px_rgba(37,99,235,0.12)]
                ${className}
            `}
        >
            {children}
        </div>
    );
}