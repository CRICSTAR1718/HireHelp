import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../../common/middleware/error-handler";
import * as permissionsService from "./permissions.service";
import {
  permissionParamsSchema,
  type CreatePermissionInput,
  type UpdatePermissionInput,
} from "./permissions.schema";
import type { PermissionData } from "./permissions.service";

type ListPermissionsResponse = { success: true; data: PermissionData[] };
type PermissionResponse = { success: true; data: PermissionData };
type MessageResponse = { success: true; message: string };

const parsePermissionIdParam = (params: Request["params"]): string => {
  const result = permissionParamsSchema.safeParse(params);
  if (!result.success) {
    throw new AppError(result.error.errors.map((error) => error.message).join(", "), 400);
  }
  return result.data.id;
};

export const listPermissions = async (_req: Request, res: Response<ListPermissionsResponse>, next: NextFunction): Promise<void> => {
  try {
    const permissions = await permissionsService.listPermissions();
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

export const getPermissionById = async (req: Request, res: Response<PermissionResponse>, next: NextFunction): Promise<void> => {
  try {
    const permission = await permissionsService.getPermissionById(parsePermissionIdParam(req.params));
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

export const createPermission = async (req: Request<object, PermissionResponse, CreatePermissionInput>, res: Response<PermissionResponse>, next: NextFunction): Promise<void> => {
  try {
    const permission = await permissionsService.createPermission(req.body);
    res.status(201).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

export const updatePermission = async (req: Request<{ id: string }, PermissionResponse, UpdatePermissionInput>, res: Response<PermissionResponse>, next: NextFunction): Promise<void> => {
  try {
    const permission = await permissionsService.updatePermission(parsePermissionIdParam(req.params), req.body);
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

export const deletePermission = async (req: Request, res: Response<MessageResponse>, next: NextFunction): Promise<void> => {
  try {
    const result = await permissionsService.deletePermission(parsePermissionIdParam(req.params));
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};
