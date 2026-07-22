const filters: string[] = [];

export default function JobFilters() {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-3">

            {filters.map((filter) => (

                <button
                    key={filter}
                    className="rounded-full bg-slate-800 px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm text-slate-300 hover:bg-blue-600"
                >
                    {filter}
                </button>

            ))}

        </div>
    );
}