import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as permissionsApi from "../../../api/admin/permissions";
import type { CreatePermissionInput, UpdatePermissionInput } from "../../../types/admin/permissions";

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: permissionsApi.getPermissions,
  });
};

export const usePermission = (id: string) => {
  return useQuery({
    queryKey: ["permissions", id],
    queryFn: () => permissionsApi.getPermission(id),
    enabled: !!id,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePermissionInput) => permissionsApi.createPermission(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create permission");
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePermissionInput }) =>
      permissionsApi.updatePermission(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions", id] });
      toast.success("Permission updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update permission");
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permissionsApi.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete permission");
    },
  });
};
