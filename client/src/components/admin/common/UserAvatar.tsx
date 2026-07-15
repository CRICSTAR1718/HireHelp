import { cn } from "../../../utils/admin/cn";

interface UserAvatarProps { firstName?: string; lastName?: string; className?: string; }

export const UserAvatar = ({ firstName = "", lastName = "", className }: UserAvatarProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "SA";
  return <span aria-label="User avatar" className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700", className)}>{initials}</span>;
};