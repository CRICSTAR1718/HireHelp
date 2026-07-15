import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "../../components/admin/ui/button";
import { useAuth } from "../../hooks/shared/useAuth";

export const DashboardPlaceholder = () => {
  const { user, logout } = useAuth();
  return <main className="min-h-screen bg-slate-50 p-6 sm:p-10"><div className="mx-auto max-w-5xl"><header className="flex items-center justify-between border-b border-slate-200 pb-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-600 p-2 text-white"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-slate-900">HireHelp Super Admin</p><p className="text-sm text-slate-500">{user?.firstName} {user?.lastName}</p></div></div><Button onClick={() => { void logout(); }} variant="outline"><LogOut className="mr-2 h-4 w-4" />Sign out</Button></header><section className="py-16"><p className="text-sm font-medium text-blue-600">Milestone 1</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Authentication foundation is ready.</h1><p className="mt-3 max-w-xl text-slate-500">Business dashboard functionality will be added in a later approved milestone.</p></section></div></main>;
};