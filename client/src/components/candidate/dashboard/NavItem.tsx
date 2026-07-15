import { NavLink } from "react-router-dom";
import clsx from "clsx";

interface Props {
    to: string;
    label: string;
    icon: React.ElementType;
}

export default function NavItem({
    to,
    label,
    icon: Icon,
}: Props) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                    isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                )
            }
        >
            <Icon size={20} />
            <span>{label}</span>
        </NavLink>
    );
}