import { LoaderCircle } from "lucide-react";
import { cn } from "../../../utils/admin/cn";

export const Spinner = ({ className }: { className?: string }) => <LoaderCircle aria-label="Loading" className={cn("animate-spin", className)} />;