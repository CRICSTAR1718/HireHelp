import { SERVICE_NAME, SERVICE_VERSION } from "../../../config/constants";

import type { HealthResponse } from "./health.schema";

export const getHealthResponse = (): HealthResponse => {
  return {
    success: true,
    message: "Super Admin Service running",
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    timestamp: new Date().toISOString()
  };
};

