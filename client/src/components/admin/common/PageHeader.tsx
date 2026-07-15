interface PageHeaderProps { title: string; description: string; }

export const PageHeader = ({ title, description }: PageHeaderProps) => <div className="mb-8"><h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{description}</p></div>;