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

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {title}
            </h1>

            {subtitle && (
                <p className="mt-2 text-slate-500 text-lg hover:text-blue-600 transition-colors">
                    {subtitle}
                </p>
            )}

        </div>
    );
}