import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable, PageHeader, ContentCard, DeleteDialog } from "../../../components/admin/common";
import { Button, Dialog, Input, Label, Textarea } from "../../../components/admin/ui";
import { usePermissions, useCreatePermission, useUpdatePermission, useDeletePermission } from "../../../hooks/admin/queries";
import { createPermissionSchema, updatePermissionSchema } from "../../../schemas/admin/permissions";
import type { Permission } from "../../../types/admin/permissions";
import type { Column } from "../../../components/admin/common/DataTable";

export const PermissionsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const { data: permissions, isLoading } = usePermissions();
  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();
  const deletePermission = useDeletePermission();

  const createForm = useForm({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      name: "",
      resource: "",
      action: "",
      description: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(updatePermissionSchema),
    defaultValues: {
      name: "",
      resource: "",
      action: "",
      description: "",
    },
  });

  const handleCreatePermission = createForm.handleSubmit(async (data) => {
    await createPermission.mutateAsync(data);
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleEditPermission = editForm.handleSubmit(async (data) => {
    if (selectedPermission) {
      await updatePermission.mutateAsync({ id: selectedPermission.id, input: data });
      setIsEditModalOpen(false);
      setSelectedPermission(null);
      editForm.reset();
    }
  });

  const handleDeletePermission = async () => {
    if (selectedPermission) {
      await deletePermission.mutateAsync(selectedPermission.id);
      setIsDeleteModalOpen(false);
      setSelectedPermission(null);
    }
  };

  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission);
    editForm.reset({
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteModalOpen(true);
  };

  const columns: Column<Permission>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => row.name,
    },
    {
      key: "resource",
      header: "Resource",
      cell: (row) => row.resource,
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => row.action,
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => row.description || "—",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditModal(row)}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => openDeleteModal(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader description="Review and manage platform permissions." title="Permissions" />

      <ContentCard
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        }
        title="All Permissions"
      >
        <DataTable columns={columns} data={permissions || []} loading={isLoading} emptyIcon={ShieldCheck} />
      </ContentCard>

      <Dialog
        description="Create a new permission with resource and action definitions."
        onClose={() => {
          setIsCreateModalOpen(false);
          createForm.reset();
        }}
        open={isCreateModalOpen}
        title="Create Permission"
      >
        <form className="space-y-4" onSubmit={handleCreatePermission}>
          <div>
            <Label htmlFor="name">Permission Name</Label>
            <Input {...createForm.register("name")} id="name" placeholder="users:read" />
            {createForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="resource">Resource</Label>
              <Input {...createForm.register("resource")} id="resource" placeholder="users" />
              {createForm.formState.errors.resource && (
                <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.resource.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="action">Action</Label>
              <Input {...createForm.register("action")} id="action" placeholder="read" />
              {createForm.formState.errors.action && (
                <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.action.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea {...createForm.register("description")} id="description" placeholder="Permission description..." />
            {createForm.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setIsCreateModalOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={createPermission.isPending} type="submit">
              {createPermission.isPending ? "Creating..." : "Create Permission"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        description="Update permission details."
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPermission(null);
          editForm.reset();
        }}
        open={isEditModalOpen}
        title="Edit Permission"
      >
        <form className="space-y-4" onSubmit={handleEditPermission}>
          <div>
            <Label htmlFor="edit-name">Permission Name</Label>
            <Input {...editForm.register("name")} id="edit-name" />
            {editForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-resource">Resource</Label>
              <Input {...editForm.register("resource")} id="edit-resource" />
              {editForm.formState.errors.resource && (
                <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.resource.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-action">Action</Label>
              <Input {...editForm.register("action")} id="edit-action" />
              {editForm.formState.errors.action && (
                <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.action.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea {...editForm.register("description")} id="edit-description" />
            {editForm.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setIsEditModalOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={updatePermission.isPending} type="submit">
              {updatePermission.isPending ? "Updating..." : "Update Permission"}
            </Button>
          </div>
        </form>
      </Dialog>

      <DeleteDialog
        description="This action cannot be undone. This will permanently delete the permission."
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedPermission(null);
        }}
        onConfirm={handleDeletePermission}
        open={isDeleteModalOpen}
        title="Delete Permission"
      />
    </div>
  );
};
