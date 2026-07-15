import { useQuery } from "@tanstack/react-query";
import * as auditApi from "../../../api/admin/audit";

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ["audit"],
    queryFn: auditApi.getAuditLogs,
  });
};

export const useAuditLog = (id: string) => {
  return useQuery({
    queryKey: ["audit", id],
    queryFn: () => auditApi.getAuditLog(id),
    enabled: !!id,
  });
};
