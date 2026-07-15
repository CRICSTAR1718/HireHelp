import { SlidersHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader, ContentCard, SectionTitle } from "../../../components/admin/common";
import { Button, Input, Label, Textarea } from "../../../components/admin/ui";
import { useConfiguration, useUpdateConfiguration } from "../../../hooks/admin/queries";
import { updateConfigurationSchema } from "../../../schemas/admin/configuration";
import type { Configuration } from "../../../types/admin/configuration";

export const ConfigurationPage = () => {
  const { data: configurations, isLoading } = useConfiguration();
  const updateConfiguration = useUpdateConfiguration();

  const form = useForm({
    resolver: zodResolver(updateConfigurationSchema),
    defaultValues: {
      key: "",
      value: "",
    },
  });

  const handleUpdate = form.handleSubmit(async (data) => {
    await updateConfiguration.mutateAsync(data);
    form.reset();
  });

  const handleEdit = (config: Configuration) => {
    form.reset({
      key: config.key,
      value: config.value,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader description="Configure platform-wide administrative settings." title="Configuration" />

      <ContentCard title="Platform Settings">
        {isLoading ? (
          <div className="min-h-64 grid place-items-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
              <p className="mt-3 text-sm text-slate-500">Loading configuration...</p>
            </div>
          </div>
        ) : configurations && configurations.length > 0 ? (
          <div className="space-y-6">
            {configurations.map((config) => (
              <div key={config.id} className="border-b border-slate-200 pb-6 last:border-0">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">{config.key}</h3>
                  {config.description && <p className="mt-1 text-sm text-slate-500">{config.description}</p>}
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <Input defaultValue={config.value} disabled readOnly />
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-64 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-sm font-semibold text-slate-900">No configuration found</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">Platform configuration will appear here once set up.</p>
          </div>
        )}
      </ContentCard>

      <ContentCard title="Update Configuration">
        <SectionTitle description="Update a configuration value by providing the key and new value." title="Quick Update" />
        <form className="mt-4 space-y-4" onSubmit={handleUpdate}>
          <div>
            <Label htmlFor="key">Configuration Key</Label>
            <Input {...form.register("key")} id="key" placeholder="e.g., max_users" />
            {form.formState.errors.key && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.key.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="value">Configuration Value</Label>
            <Textarea {...form.register("value")} id="value" placeholder="e.g., 100" />
            {form.formState.errors.value && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.value.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => form.reset()} type="button" variant="outline">
              Reset
            </Button>
            <Button disabled={updateConfiguration.isPending} type="submit">
              {updateConfiguration.isPending ? "Updating..." : "Update Configuration"}
            </Button>
          </div>
        </form>
      </ContentCard>
    </div>
  );
};
