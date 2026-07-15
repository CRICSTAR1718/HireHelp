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
                <label className="text-sm text-slate-300 hover:text-blue-400 transition-colors">
                    {label}
                </label>
            )}

            <input
                {...props}
                className="
          w-full
          rounded-xl
          border
          border-slate-600/50
          bg-slate-800/50
          px-4
          py-3
          text-white
          outline-none
          focus:border-blue-500/50
          focus:shadow-lg
          focus:shadow-blue-500/10
          transition-all
          duration-300
          placeholder:text-slate-500
        "
            />
        </div>
    );
}

