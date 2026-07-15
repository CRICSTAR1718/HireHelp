import { FileText } from "lucide-react";
import { PageHeader, ContentCard, DataTable } from "../../../components/admin/common";
import { useAuditLogs } from "../../../hooks/admin/queries";
import type { AuditLog } from "../../../types/admin/audit";
import type { Column } from "../../../components/admin/common/DataTable";

export const AuditPage = () => {
  const { data: auditLogs, isLoading } = useAuditLogs();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const columns: Column<AuditLog>[] = [
    {
      key: "user",
      header: "User ID",
      cell: (row) => row.userId,
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => row.action,
    },
    {
      key: "entity",
      header: "Entity",
      cell: (row) => `${row.entityType}:${row.entityId}`,
    },
    {
      key: "ipAddress",
      header: "IP Address",
      cell: (row) => row.ipAddress || "—",
    },
    {
      key: "timestamp",
      header: "Timestamp",
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader description="Review administrative activity and platform audit events." title="Audit Logs" />

      <ContentCard title="All Audit Logs">
        <DataTable
          columns={columns}
          data={auditLogs || []}
          loading={isLoading}
          emptyIcon={<FileText />}
          emptyMessage="No audit logs found. Activity will be recorded here as users interact with the platform."
        />
      </ContentCard>
    </div>
  );
};
