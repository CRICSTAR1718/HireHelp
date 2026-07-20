import { Plus, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable, PageHeader, ContentCard, DeleteDialog, StatusBadge } from "../../../components/admin/common";
import { Button, Dialog, Input, Label, Select } from "../../../components/admin/ui";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useRoles, useDepartments } from "../../../hooks/admin/queries";
import { createUserSchema, updateUserSchema } from "../../../schemas/admin/users";
import type { User } from "../../../types/admin/users";
import type { Column } from "../../../components/admin/common/DataTable";

export const UsersPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading } = useUsers();
  const { data: roles } = useRoles();
  const { data: departments } = useDepartments();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const createForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      roleId: "",
      departmentId: "",
      password: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      roleId: "",
      departmentId: "",
      isActive: true,
    },
  });

  const handleCreateUser = createForm.handleSubmit(async (data) => {
    await createUser.mutateAsync(data);
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleEditUser = editForm.handleSubmit(async (data) => {
    if (selectedUser) {
      await updateUser.mutateAsync({ id: selectedUser.id, input: data });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      editForm.reset();
    }
  });

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser.mutateAsync(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || "",
      roleId: user.roleId,
      departmentId: user.departmentId || "",
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => row.email,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (row) => row.phone || "—",
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => roles?.find((r) => r.id === row.roleId)?.name || "—",
    },
    {
      key: "department",
      header: "Department",
      cell: (row) => departments?.find((d) => d.id === row.departmentId)?.name || "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge label={row.isActive ? "Active" : "Inactive"} tone={row.isActive ? "success" : "neutral"} />
      ),
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
      <PageHeader description="Manage admin, HR, and interviewer accounts." title="Users" />

      <ContentCard
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
        title="All Users"
      >
        <DataTable columns={columns} data={users || []} loading={isLoading} emptyIcon={<UserRound />} />
      </ContentCard>

      <Dialog
        description="Create a new user account with appropriate role and department assignments."
        onClose={() => {
          setIsCreateModalOpen(false);
          createForm.reset();
        }}
        open={isCreateModalOpen}
        title="Create User"
      >
        <form className="space-y-4" onSubmit={handleCreateUser}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input {...createForm.register("firstName")} id="firstName" placeholder="John" />
              {createForm.formState.errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input {...createForm.register("lastName")} id="lastName" placeholder="Doe" />
              {createForm.formState.errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input {...createForm.register("email")} id="email" placeholder="john.doe@example.com" type="email" />
            {createForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input {...createForm.register("phone")} id="phone" placeholder="+1 234 567 8900" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="roleId">Role</Label>
              <Select {...createForm.register("roleId")} id="roleId">
                <option value="">Select a role</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
              {createForm.formState.errors.roleId && (
                <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.roleId.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="departmentId">Department</Label>
              <Select {...createForm.register("departmentId")} id="departmentId">
                <option value="">Select a department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input {...createForm.register("password")} id="password" placeholder="••••••••" type="password" />
            {createForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setIsCreateModalOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={createUser.isPending} type="submit">
              {createUser.isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        description="Update user information, role assignments, and account status."
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
          editForm.reset();
        }}
        open={isEditModalOpen}
        title="Edit User"
      >
        <form className="space-y-4" onSubmit={handleEditUser}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-firstName">First Name</Label>
              <Input {...editForm.register("firstName")} id="edit-firstName" />
              {editForm.formState.errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-lastName">Last Name</Label>
              <Input {...editForm.register("lastName")} id="edit-lastName" />
              {editForm.formState.errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input {...editForm.register("email")} id="edit-email" type="email" />
            {editForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-phone">Phone</Label>
            <Input {...editForm.register("phone")} id="edit-phone" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-roleId">Role</Label>
              <Select {...editForm.register("roleId")} id="edit-roleId">
                <option value="">Select a role</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
              {editForm.formState.errors.roleId && (
                <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.roleId.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-departmentId">Department</Label>
              <Select {...editForm.register("departmentId")} id="edit-departmentId">
                <option value="">Select a department</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              {...editForm.register("isActive")}
              id="edit-isActive"
              type="checkbox"
            />
            <Label htmlFor="edit-isActive" className="mb-0">
              Active
            </Label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setIsEditModalOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={updateUser.isPending} type="submit">
              {updateUser.isPending ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </Dialog>

      <DeleteDialog
        description="This action cannot be undone. This will permanently delete the user account."
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        open={isDeleteModalOpen}
        title="Delete User"
      />
    </div>
  );
};
