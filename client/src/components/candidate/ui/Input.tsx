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
                    focus:border-[var(--hh-accent)]
          focus:shadow-[0_0_0_3px_var(--hh-accent-soft)]
          transition-[border-color,box-shadow]
          duration-[175ms]
          ease-[var(--hh-ease)]
                    placeholder:text-slate-400
        "
            />
        </div>
    );
}

