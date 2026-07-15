import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../../common/middleware/error-handler";
import * as usersService from "./users.service";
import {
  userParamsSchema,
  type CreateUserInput,
  type UpdateUserInput,
  type ChangeUserPasswordInput,
} from "./users.schema";
import type { UserData } from "./users.service";

type ListUsersResponse = { success: true; data: UserData[] };
type UserResponse = { success: true; data: UserData };
type MessageResponse = { success: true; message: string };

const parseUserIdParam = (params: Request["params"]): string => {
  const result = userParamsSchema.safeParse(params);
  if (!result.success) {
    throw new AppError(result.error.errors.map((error) => error.message).join(", "), 400);
  }
  return result.data.id;
};

export const listUsers = async (_req: Request, res: Response<ListUsersResponse>, next: NextFunction): Promise<void> => {
  try {
    const users = await usersService.listUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response<UserResponse>, next: NextFunction): Promise<void> => {
  try {
    const user = await usersService.getUserById(parseUserIdParam(req.params));
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request<object, UserResponse, CreateUserInput>, res: Response<UserResponse>, next: NextFunction): Promise<void> => {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request<{ id: string }, UserResponse, UpdateUserInput>, res: Response<UserResponse>, next: NextFunction): Promise<void> => {
  try {
    const user = await usersService.updateUser(parseUserIdParam(req.params), req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword = async (req: Request<{ id: string }, MessageResponse, ChangeUserPasswordInput>, res: Response<MessageResponse>, next: NextFunction): Promise<void> => {
  try {
    const result = await usersService.changeUserPassword(parseUserIdParam(req.params), req.body);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req: Request, res: Response<MessageResponse>, next: NextFunction): Promise<void> => {
  try {
    const result = await usersService.deactivateUser(parseUserIdParam(req.params));
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};
