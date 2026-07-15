const filters = [
    "All",
    "Remote",
    "Full Time",
    "Internship",
    "Frontend",
    "Backend",
    "AI",
];

export default function JobFilters() {
    return (
        <div className="flex flex-wrap gap-3">

            {filters.map((filter) => (

                <button
                    key={filter}
                    className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-blue-600"
                >
                    {filter}
                </button>

            ))}

        </div>
    );
}