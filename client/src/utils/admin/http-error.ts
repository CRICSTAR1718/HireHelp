import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "../../types/admin/api";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<ApiErrorResponse>(error)) return error.response?.data.message ?? fallback;
  return error instanceof Error ? error.message : fallback;
};