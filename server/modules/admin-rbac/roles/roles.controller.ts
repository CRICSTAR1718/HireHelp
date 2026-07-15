import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../../common/middleware/error-handler";
import * as rolesService from "./roles.service";
import {
  roleParamsSchema,
  type CreateRoleInput,
  type UpdateRoleInput,
  type AssignPermissionInput,
} from "./roles.schema";
import type { RoleData, PermissionData } from "./roles.service";

type ListRolesResponse = { success: true; data: RoleData[] };
type RoleResponse = { success: true; data: RoleData };
type ListPermissionsResponse = { success: true; data: PermissionData[] };
type MessageResponse = { success: true; message: string };

const parseRoleIdParam = (params: Request["params"]): string => {
  const result = roleParamsSchema.safeParse(params);
  if (!result.success) {
    throw new AppError(result.error.errors.map((error) => error.message).join(", "), 400);
  }
  return result.data.id;
};

export const listRoles = async (_req: Request, res: Response<ListRolesResponse>, next: NextFunction): Promise<void> => {
  try {
    const roles = await rolesService.listRoles();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

export const getRoleById = async (req: Request, res: Response<RoleResponse>, next: NextFunction): Promise<void> => {
  try {
    const role = await rolesService.getRoleById(parseRoleIdParam(req.params));
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req: Request<object, RoleResponse, CreateRoleInput>, res: Response<RoleResponse>, next: NextFunction): Promise<void> => {
  try {
    const role = await rolesService.createRole(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request<{ id: string }, RoleResponse, UpdateRoleInput>, res: Response<RoleResponse>, next: NextFunction): Promise<void> => {
  try {
    const role = await rolesService.updateRole(parseRoleIdParam(req.params), req.body);
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req: Request, res: Response<MessageResponse>, next: NextFunction): Promise<void> => {
  try {
    const result = await rolesService.deleteRole(parseRoleIdParam(req.params));
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const listRolePermissions = async (req: Request, res: Response<ListPermissionsResponse>, next: NextFunction): Promise<void> => {
  try {
    const permissions = await rolesService.listRolePermissions(parseRoleIdParam(req.params));
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

export const assignPermission = async (req: Request<{ id: string }, MessageResponse, AssignPermissionInput>, res: Response<MessageResponse>, next: NextFunction): Promise<void> => {
  try {
    const result = await rolesService.assignPermission(parseRoleIdParam(req.params), req.body.permissionId);
    res.status(201).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const revokePermission = async (req: Request<{ id: string; permissionId: string }>, res: Response<MessageResponse>, next: NextFunction): Promise<void> => {
  try {
    const result = await rolesService.revokePermission(parseRoleIdParam(req.params), req.params.permissionId);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};
