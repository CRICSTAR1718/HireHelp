import type { LucideIcon } from "lucide-react";

interface EmptyStateProps { icon: LucideIcon; title: string; description: string; }

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center hh-fade-in"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon className="h-6 w-6" /></div><h2 className="mt-4 text-sm font-semibold text-slate-900">{title}</h2><p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p></div>;