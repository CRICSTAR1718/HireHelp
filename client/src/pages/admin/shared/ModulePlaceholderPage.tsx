import type { LucideIcon } from "lucide-react";
import { ContentCard, EmptyState, PageHeader } from "../../../components/admin/common";

interface ModulePlaceholderPageProps { title: string; description: string; icon: LucideIcon; }
export const ModulePlaceholderPage = ({ title, description, icon }: ModulePlaceholderPageProps) => <div className="mx-auto max-w-7xl"><PageHeader description={description} title={title} /><ContentCard title={`${title} workspace`}><EmptyState description={`The ${title.toLowerCase()} experience will be connected in its dedicated implementation milestone.`} icon={icon} title={`${title} is ready for setup`} /></ContentCard></div>;