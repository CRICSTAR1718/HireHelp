import { LogOut, Settings, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../hooks/shared/useAuth";
import { UserAvatar } from "../common/UserAvatar";

interface ProfileDropdownProps { userType?: string; }

export const ProfileDropdown = ({ userType = "Admin" }: ProfileDropdownProps) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const name = `${user?.firstName ?? "Super"} ${user?.lastName ?? "Admin"}`;
  
  return (
    <div className="relative">
      <button 
        aria-expanded={open} 
        aria-haspopup="menu" 
        className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100" 
        onClick={() => setOpen((value) => !value)} 
        type="button"
      >
        <UserAvatar firstName={user?.firstName} lastName={user?.lastName} />
        <span className="hidden text-left lg:block">
          <span className="block text-sm font-medium text-slate-800">{name}</span>
          <span className="block text-xs text-slate-500">{userType}</span>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg" role="menu">
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="truncate text-sm font-medium text-slate-900">{name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
            onClick={() => setOpen(false)}
            type="button"
          >
            <UserRound className="h-4 w-4" />Profile
          </button>
          {userType !== "Admin" && (
            <button
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              onClick={() => setOpen(false)}
              type="button"
            >
              <Settings className="h-4 w-4" />Settings
            </button>
          )}
          <button 
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50" 
            onClick={() => { void logout(); }} 
            type="button"
          >
            <LogOut className="h-4 w-4" />Sign out
          </button>
        </div>
      )}
    </div>
  );
};