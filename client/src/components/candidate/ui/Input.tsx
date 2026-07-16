import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

export default function Input({
    label,
    ...props
}: Props) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm text-slate-700 hover:text-blue-600 transition-colors">
                    {label}
                </label>
            )}

            <input
                {...props}
                className="
          w-full
          rounded-xl
          border
                    border-blue-200
                    bg-white
          px-4
          py-3
                    text-slate-900
          outline-none
                    focus:border-blue-500
          focus:shadow-lg
          focus:shadow-blue-500/10
          transition-all
          duration-300
                    placeholder:text-slate-400
        "
            />
        </div>
    );
}

