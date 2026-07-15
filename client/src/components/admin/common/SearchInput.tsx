import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const SearchInput = () => <div className="relative w-full max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input aria-label="Search" className="h-10 bg-slate-50 pl-9" placeholder="Search..." /></div>;