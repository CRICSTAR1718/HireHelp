interface Props {
    title: string;
    subtitle?: string;
}

export default function PageTitle({
    title,
    subtitle,
}: Props) {
    return (
        <div className="mb-8">

            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {title}
            </h1>

            {subtitle && (
                <p className="mt-2 text-slate-400 text-lg hover:text-blue-400 transition-colors">
                    {subtitle}
                </p>
            )}

        </div>
    );
}