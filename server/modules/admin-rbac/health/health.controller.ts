import type { Request, Response } from "express";

import { getHealthResponse } from "./health.service";
import type { HealthResponse } from "./health.schema";

export const getHealth = (_req: Request, res: Response<HealthResponse>) => {
  res.status(200).json(getHealthResponse());
};

