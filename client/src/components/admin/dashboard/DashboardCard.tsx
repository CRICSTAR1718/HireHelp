import type { PropsWithChildren, ReactNode } from "react";
import { ContentCard } from "../common/ContentCard";

interface DashboardCardProps extends PropsWithChildren { title: string; action?: ReactNode; }
export const DashboardCard = ({ title, action, children }: DashboardCardProps) => <ContentCard action={action} title={title}>{children}</ContentCard>;