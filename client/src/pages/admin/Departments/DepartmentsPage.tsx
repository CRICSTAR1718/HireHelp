import { Plus, Building2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable, PageHeader, ContentCard, DeleteDialog } from "../../../components/admin/common";
import { Button, Dialog, Input, Label, Textarea } from "../../../components/admin/ui";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "../../../hooks/admin/queries";
import { createDepartmentSchema, updateDepartmentSchema } from "../../../schemas/admin/departments";
import type { Department } from "../../../types/admin/departments";
import type { Column } from "../../../components/admin/common/DataTable";

export const DepartmentsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const { data: departments, isLoading } = useDepartments();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const createForm = useForm({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const handleCreateDepartment = createForm.handleSubmit(async (data) => {
    await createDepartment.mutateAsync(data);
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleEditDepartment = editForm.handleSubmit(async (data) => {
    if (selectedDepartment) {
      await updateDepartment.mutateAsync({ id: selectedDepartment.id, input: data });
      setIsEditModalOpen(false);
      setSelectedDepartment(null);
      editForm.reset();
    }
  });

  const handleDeleteDepartment = async () => {
    if (selectedDepartment) {
      await deleteDepartment.mutateAsync(selectedDepartment.id);
      setIsDeleteModalOpen(false);
      setSelectedDepartment(null);
    }
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    editForm.reset({
      name: department.name,
      code: department.code,
      description: department.description || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const columns: Column<Department>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => row.name,
    },
    {
      key: "code",
      header: "Code",
      cell: (row) => row.code,
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
      <PageHeader description="Organize departments across the recruitment platform." title="Departments" />

      <ContentCard
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        }
        title="All Departments"
      >
        <DataTable columns={columns} data={departments || []} loading={isLoading} emptyIcon={<Building2 />} />
      </ContentCard>

      <Dialog
        description="Create a new department with code and description."
        onClose={() => {
          setIsCreateModalOpen(false);
          createForm.reset();
        }}
        open={isCreateModalOpen}
        title="Create Department"
      >
        <form className="space-y-4" onSubmit={handleCreateDepartment}>
          <div>
            <Label htmlFor="name">Department Name</Label>
            <Input {...createForm.register("name")} id="name" placeholder="Engineering" />
            {createForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="code">Department Code</Label>
            <Input {...createForm.register("code")} id="code" placeholder="ENG" />
            {createForm.formState.errors.code && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.code.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea {...createForm.register("description")} id="description" placeholder="Department description..." />
            {createForm.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setIsCreateModalOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={createDepartment.isPending} type="submit">
              {createDepartment.isPending ? "Creating..." : "Create Department"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        description="Update department information."
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
          editForm.reset();
        }}
        open={isEditModalOpen}
        title="Edit Department"
      >
        <form className="space-y-4" onSubmit={handleEditDepartment}>
          <div>
            <Label htmlFor="edit-name">Department Name</Label>
            <Input {...editForm.register("name")} id="edit-name" />
            {editForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-code">Department Code</Label>
            <Input {...editForm.register("code")} id="edit-code" />
            {editForm.formState.errors.code && (
              <p className="mt-1 text-sm text-red-600">{editForm.formState.errors.code.message}</p>
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
            <Button disabled={updateDepartment.isPending} type="submit">
              {updateDepartment.isPending ? "Updating..." : "Update Department"}
            </Button>
          </div>
        </form>
      </Dialog>

      <DeleteDialog
        description="This action cannot be undone. This will permanently delete the department."
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleDeleteDepartment}
        open={isDeleteModalOpen}
        title="Delete Department"
      />
    </div>
  );
};
