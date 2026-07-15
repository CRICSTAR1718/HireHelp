import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

import { AppError } from "./error-handler";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors.map((error) => error.message).join(", ");
      throw new AppError(message, 400);
    }

    req.body = result.data;
    next();
  };
};
