import { AppError } from "../../../common/middleware/error-handler";
import {
  create,
  deleteById,
  deleteByName,
  findAll,
  findById,
  update,
  type Department,
} from "./departments.repository";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "./departments.schema";

export type DepartmentData = {
  id: string;
  name: string;
  description: string | null;
  parentDepartmentId: string | null;
  headUserId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const toDepartmentResponse = (department: Department): DepartmentData => ({
  id: department.id,
  name: department.name,
  description: department.description,
  parentDepartmentId: department.parentDepartmentId,
  headUserId: department.headUserId,
  isActive: department.isActive,
  createdAt: department.createdAt.toISOString(),
  updatedAt: department.updatedAt.toISOString(),
});

const ensureNameAvailable = async (name: string, currentId?: string): Promise<void> => {
  const departments = await findAll();
  const duplicate = departments.find(
    (department) => department.id !== currentId && department.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    throw new AppError("Department name already in use", 409);
  }
};

const ensureParentExists = async (parentDepartmentId: string | null | undefined, departmentId?: string): Promise<void> => {
  if (parentDepartmentId === null || parentDepartmentId === undefined) {
    return;
  }

  if (parentDepartmentId === departmentId) {
    throw new AppError("Department cannot be its own parent", 400);
  }

  const parent = await findById(parentDepartmentId);

  if (!parent) {
    throw new AppError("Parent department not found", 404);
  }
};

export const listDepartments = async (): Promise<DepartmentData[]> => {
  const departments = await findAll();
  return departments.map(toDepartmentResponse);
};

export const getDepartmentById = async (id: string): Promise<DepartmentData> => {
  const department = await findById(id);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return toDepartmentResponse(department);
};

export const createDepartment = async (
  input: CreateDepartmentInput
): Promise<DepartmentData> => {
  await ensureNameAvailable(input.name);
  await ensureParentExists(input.parentDepartmentId);

  const department = await create({
    name: input.name,
    description: input.description ?? null,
    parentDepartmentId: input.parentDepartmentId ?? null,
    headUserId: input.headUserId ?? null,
    isActive: true,
  });

  return toDepartmentResponse(department);
};

export const updateDepartment = async (
  id: string,
  input: UpdateDepartmentInput
): Promise<DepartmentData> => {
  const department = await findById(id);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  if (input.name !== undefined && input.name.toLowerCase() !== department.name.toLowerCase()) {
    await ensureNameAvailable(input.name, id);
  }

  await ensureParentExists(input.parentDepartmentId, id);

  const updatedDepartment = await update(id, {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.parentDepartmentId !== undefined ? { parentDepartmentId: input.parentDepartmentId } : {}),
    ...(input.headUserId !== undefined ? { headUserId: input.headUserId } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
  });

  if (!updatedDepartment) {
    throw new AppError("Department not found", 404);
  }

  return toDepartmentResponse(updatedDepartment);
};

export const deleteDepartment = async (id: string): Promise<{ message: string }> => {
  const department = await findById(id);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  if (department.isActive) {
    await deleteById(id);
  }

  return { message: "Department deleted successfully" };
};

export const deleteDepartmentsByName = async (name: string): Promise<{ message: string; count: number }> => {
  const departments = await deleteByName(name);
  
  if (departments.length === 0) {
    throw new AppError("No departments found with the specified name", 404);
  }

  return { 
    message: `Successfully deleted ${departments.length} department(s) with name containing "${name}"`,
    count: departments.length 
  };
};