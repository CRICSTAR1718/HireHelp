import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface DeleteDialogProps { open: boolean; title: string; description: string; onCancel: () => void; onConfirm: () => void; }

export const DeleteDialog = ({ open, title, description, onCancel, onConfirm }: DeleteDialogProps) => {
  if (!open) return null;
  return <div aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4" role="dialog"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><AlertTriangle className="h-6 w-6 text-red-600" /><h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><div className="mt-6 flex justify-end gap-3"><Button onClick={onCancel} variant="outline">Cancel</Button><Button onClick={onConfirm}>Confirm</Button></div></div></div>;
};