import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as departmentsApi from "../../../api/admin/departments";
import { toUserMessage } from "../../../utils/toUserMessage";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "../../../types/admin/departments";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getDepartments,
  });
};

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => departmentsApi.getDepartment(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDepartmentInput) => departmentsApi.createDepartment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
    },
    onError: (error: Error) => {
      toast.error(toUserMessage(error, "Failed to create department. Please try again."));
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDepartmentInput }) =>
      departmentsApi.updateDepartment(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", id] });
      toast.success("Department updated successfully");
    },
    onError: (error: Error) => {
      toast.error(toUserMessage(error, "Failed to update department. Please try again."));
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentsApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(toUserMessage(error, "Failed to delete department. Please try again."));
    },
  });
};
