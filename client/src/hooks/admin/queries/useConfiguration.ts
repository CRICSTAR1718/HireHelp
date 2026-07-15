import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as configurationApi from "../../../api/admin/configuration";
import type { UpdateConfigurationInput } from "../../../types/admin/configuration";

export const useConfiguration = () => {
  return useQuery({
    queryKey: ["configuration"],
    queryFn: configurationApi.getConfiguration,
  });
};

export const useUpdateConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateConfigurationInput) => configurationApi.updateConfiguration(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
      toast.success("Configuration updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update configuration");
    },
  });
};
