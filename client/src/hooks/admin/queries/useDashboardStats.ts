import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../../api/admin/users';
import { getRoles } from '../../../api/admin/roles';
import { getDepartments } from '../../../api/admin/departments';
import { getApprovals } from '../../../api/admin/approvals';

export interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalDepartments: number;
  pendingApprovals: number;
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [users, roles, departments, approvals] = await Promise.all([
        getUsers().catch(() => []),
        getRoles().catch(() => []),
        getDepartments().catch(() => []),
        getApprovals().catch(() => []),
      ]);

      return {
        totalUsers: users.length,
        totalRoles: roles.length,
        totalDepartments: departments.length,
        pendingApprovals: approvals.filter(a => a.status === 'pending').length,
      };
    },
  });
};
