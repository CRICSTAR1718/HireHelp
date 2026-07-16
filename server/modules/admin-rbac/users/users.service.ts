import { AppError } from "../../../common/middleware/error-handler";
import { hashPassword } from "../../../common/utils/password";
import { sendWelcomeEmail } from "../../../common/utils/email.service";
import { env } from "../../../config/env";
import {
  create,
  deleteById,
  findAll,
  findByEmail,
  findById,
  update,
  type User,
} from "./users.repository";
import { findById as findRoleById } from "../roles/roles.repository";
import { findById as findDepartmentById } from "../departments/departments.repository";
import type {
  CreateUserInput,
  UpdateUserInput,
  ChangeUserPasswordInput,
} from "./users.schema";

// Deliberately excludes passwordHash — this is the shape returned to API
// consumers, never the raw DB row.
export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  roleId: string;
  departmentId: string | null;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

const toUserResponse = (user: User): UserData => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  roleId: user.roleId,
  departmentId: user.departmentId,
  isActive: user.isActive,
  lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const ensureRoleExists = async (roleId: string): Promise<void> => {
  const role = await findRoleById(roleId);
  if (!role) {
    throw new AppError("Role not found", 404);
  }
};

const ensureDepartmentExists = async (departmentId: string | null | undefined): Promise<void> => {
  if (departmentId === null || departmentId === undefined) {
    return;
  }
  const department = await findDepartmentById(departmentId);
  if (!department) {
    throw new AppError("Department not found", 404);
  }
};

export const listUsers = async (): Promise<UserData[]> => {
  const users = await findAll();
  return users.map(toUserResponse);
};

export const getUserById = async (id: string): Promise<UserData> => {
  const user = await findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toUserResponse(user);
};

export const createUser = async (input: CreateUserInput): Promise<UserData> => {
  const existing = await findByEmail(input.email);
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  await ensureRoleExists(input.roleId);
  await ensureDepartmentExists(input.departmentId);

  const passwordHash = await hashPassword(input.password);

  const user = await create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    passwordHash,
    phone: input.phone ?? null,
    roleId: input.roleId,
    departmentId: input.departmentId ?? null,
    isActive: true,
  });

  // Send welcome email after successful user creation
  try {
    const role = await findRoleById(input.roleId);
    const roleName = role?.name || 'Staff Member';
    const fullName = `${input.firstName} ${input.lastName}`;
    const loginUrl = `${env.CLIENT_ORIGIN}/login`;

    await sendWelcomeEmail({
      to: input.email,
      name: fullName,
      role: roleName,
      email: input.email,
      temporaryPassword: input.password,
      loginUrl,
    });
  } catch (error) {
    // Email failure is logged but does not prevent user creation
    console.error('Failed to send welcome email:', error);
  }

  return toUserResponse(user);
};

export const updateUser = async (id: string, input: UpdateUserInput): Promise<UserData> => {
  const user = await findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (input.roleId !== undefined) {
    await ensureRoleExists(input.roleId);
  }
  if (input.departmentId !== undefined) {
    await ensureDepartmentExists(input.departmentId);
  }

  const updatedUser = await update(id, {
    ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
    ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.roleId !== undefined ? { roleId: input.roleId } : {}),
    ...(input.departmentId !== undefined ? { departmentId: input.departmentId } : {}),
    ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
  });

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return toUserResponse(updatedUser);
};

export const changeUserPassword = async (
  id: string,
  input: ChangeUserPasswordInput
): Promise<{ message: string }> => {
  const user = await findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const passwordHash = await hashPassword(input.password);
  await update(id, { passwordHash });

  return { message: "Password updated successfully" };
};

// Soft-delete only (users.repository.deleteById sets isActive=false) — never
// hard-deletes a staff user, since audit_logs.userId and many recruitment
// tables reference users.id and would be orphaned/ambiguous otherwise.
export const deactivateUser = async (id: string): Promise<{ message: string }> => {
  const user = await findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await deleteById(id);
  return { message: "User deactivated successfully" };
};
