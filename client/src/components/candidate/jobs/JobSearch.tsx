import { Search } from "lucide-react";

export default function JobSearch() {
    return (
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/50 p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">

            <div className="flex items-center gap-3">

                <Search className="text-slate-400 transition-colors" />

                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full bg-transparent outline-none text-white placeholder:text-slate-500 transition-all focus:placeholder:text-slate-400"
                />

            </div>

        </div>
    );
}