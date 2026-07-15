import { Plus, ShieldCheck, Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable, PageHeader, ContentCard, DeleteDialog } from "../../../components/admin/common";
import { Button, Dialog, Input, Label, Textarea } from "../../../components/admin/ui";
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole, useRolePermissions, usePermissions, useSetRolePermissions } from "../../../hooks/admin/queries";
import { createRoleSchema, updateRoleSchema } from "../../../schemas/admin/roles";
import type { Role } from "../../../types/admin/roles";
import type { Column } from "../../../components/admin/common/DataTable";

export const RolesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { data: roles, isLoading } = useRoles();
  const { data: permissions } = usePermissions();
  const { data: rolePermissions } = useRolePermissions(selectedRole?.id || "");
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();
  const setRolePermissions = useSetRolePermissions();

  const createForm = useForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreateRole = createForm.handleSubmit(async (data) => {
    await createRole.mutateAsync(data);
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleEditRole = editForm.handleSubmit(async (data) => {
    if (selectedRole) {
      await updateRole.mutateAsync({ id: selectedRole.id, input: data });
      setIsEditModalOpen(false);
      setSelectedRole(null);
      editForm.reset();
    }
  });

  const handleDeleteRole = async () => {
    if (selectedRole) {
      await deleteRole.mutateAsync(selectedRole.id);
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const handleSavePermissions = async () => {
    if (selectedRole) {
      const selectedPermissionIds = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
      await setRolePermissions.mutateAsync({ roleId: selectedRole.id, permissionIds: selectedPermissionIds });
      setIsPermissionsModalOpen(false);
      setSelectedRole(null);
    }
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    editForm.reset({
      name: role.name,
      description: role.description || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const openPermissionsModal = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsModalOpen(true);
  };

  const columns: Column<Role>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => row.name,
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => row.description || "—",
    },
    {
      key: "permissions",
      header: "Permissions",
      cell: (row) => {
        const rolePerms = rolePermissions?.filter(p => p.id === row.id);
        return rolePerms?.length ? `${rolePerms.length} permissions` : "No permissions";
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openPermissionsModal(row)}>
            <Settings className="mr-1 h-4 w-4" />
            Permissions
          </Button>
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
      <PageHeader description="Define and maintain the platform role catalog." title="Roles" />

      <ContentCard
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        }
        title="All Roles"
      >
        <DataTable columns={columns} data={roles || []} loading={isLoading} emptyIcon={<ShieldCheck />} />
      </ContentCard>

      <Dialog
        description="Create a new role with appropriate description."
        onClose={() => {
          setIsCreateModalOpen(false);
          createForm.reset();
        }}
        open={isCreateModalOpen}
        title="Create Role"
      >
        <form className="space-y-4" onSubmit={handleCreateRole}>
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input {...createForm.register("name")} id="name" placeholder="Admin" />
            {createForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea {...createForm.register("description")} id="description" placeholder="Role description..." />
            {createForm.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setIsCreateModalOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={createRole.isPending} type="submit">
              {createRole.isPending ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        description="Update role information and description."
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRole(null);
          editForm.reset();
        }}
        open={isEditModalOpen}
        title="Edit Role"
      >
        <form className="space-y-4" onSubmit={handleEditRole}>
          <div>
            <Label htmlFor="edit-name">Role Name</Label>
            <Input {...editForm.register("name")} id="edit-name" />
            {editForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.name.message}</p>
            )}
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
            <Button disabled={updateRole.isPending} type="submit">
              {updateRole.isPending ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        description="Manage permissions assigned to this role."
        onClose={() => {
          setIsPermissionsModalOpen(false);
          setSelectedRole(null);
        }}
        open={isPermissionsModalOpen}
        title="Manage Permissions"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {permissions?.map((permission) => (
            <div key={permission.id} className="flex items-center gap-3">
              <input
                defaultChecked={rolePermissions?.some(p => p.id === permission.id)}
                id={`perm-${permission.id}`}
                type="checkbox"
                value={permission.id}
              />
              <Label htmlFor={`perm-${permission.id}`} className="flex-1 cursor-pointer">
                <div className="font-medium">{permission.name}</div>
                <div className="text-sm text-slate-500">{permission.resource} - {permission.action}</div>
              </Label>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={() => setIsPermissionsModalOpen(false)} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={setRolePermissions.isPending} onClick={handleSavePermissions}>
            {setRolePermissions.isPending ? "Saving..." : "Save Permissions"}
          </Button>
        </div>
      </Dialog>

      <DeleteDialog
        description="This action cannot be undone. This will permanently delete the role."
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedRole(null);
        }}
        onConfirm={handleDeleteRole}
        open={isDeleteModalOpen}
        title="Delete Role"
      />
    </div>
  );
};
