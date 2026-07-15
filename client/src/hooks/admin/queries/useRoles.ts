import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as rolesApi from "../../../api/admin/roles";
import type { CreateRoleInput, UpdateRoleInput } from "../../../types/admin/roles";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: rolesApi.getRoles,
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => rolesApi.getRole(id),
    enabled: !!id,
  });
};

export const useRolePermissions = (roleId: string) => {
  return useQuery({
    queryKey: ["roles", roleId, "permissions"],
    queryFn: () => rolesApi.getRolePermissions(roleId),
    enabled: !!roleId,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoleInput) => rolesApi.createRole(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create role");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) =>
      rolesApi.updateRole(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", id] });
      toast.success("Role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update role");
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete role");
    },
  });
};

export const useSetRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      rolesApi.setRolePermissions(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ["roles", roleId, "permissions"] });
      toast.success("Role permissions updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update role permissions");
    },
  });
};

export const useRemoveRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      rolesApi.removeRolePermission(roleId, permissionId),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ["roles", roleId, "permissions"] });
      toast.success("Permission removed from role successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove permission from role");
    },
  });
};
