import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../../common/middleware/error-handler";
import * as departmentsService from "./departments.service";
import {
  departmentParamsSchema,
  type CreateDepartmentInput,
  type UpdateDepartmentInput,
} from "./departments.schema";
import type { DepartmentData } from "./departments.service";

type ListDepartmentsResponse = { success: true; data: DepartmentData[] };
type DepartmentResponse = { success: true; data: DepartmentData };
type DeleteDepartmentResponse = { success: true; message: string };
type DeleteDepartmentsByNameResponse = { success: true; message: string; count: number };

const parseDepartmentIdParam = (params: Request["params"]): string => {
  const result = departmentParamsSchema.safeParse(params);

  if (!result.success) {
    throw new AppError(result.error.errors.map((error) => error.message).join(", "), 400);
  }

  return result.data.id;
};

export const listDepartments = async (_req: Request, res: Response<ListDepartmentsResponse>, next: NextFunction): Promise<void> => {
  try {
    const departments = await departmentsService.listDepartments();
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req: Request, res: Response<DepartmentResponse>, next: NextFunction): Promise<void> => {
  try {
    const department = await departmentsService.getDepartmentById(parseDepartmentIdParam(req.params));
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req: Request<object, DepartmentResponse, CreateDepartmentInput>, res: Response<DepartmentResponse>, next: NextFunction): Promise<void> => {
  try {
    const department = await departmentsService.createDepartment(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req: Request<{ id: string }, DepartmentResponse, UpdateDepartmentInput>, res: Response<DepartmentResponse>, next: NextFunction): Promise<void> => {
  try {
    const department = await departmentsService.updateDepartment(parseDepartmentIdParam(req.params), req.body);
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req: Request, res: Response<DeleteDepartmentResponse>, next: NextFunction): Promise<void> => {
  try {
    const result = await departmentsService.deleteDepartment(parseDepartmentIdParam(req.params));
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartmentsByName = async (req: Request<{ name: string }>, res: Response<DeleteDepartmentsByNameResponse>, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.params;
    const result = await departmentsService.deleteDepartmentsByName(name);
    res.status(200).json({ success: true, message: result.message, count: result.count });
  } catch (error) {
    next(error);
  }
};