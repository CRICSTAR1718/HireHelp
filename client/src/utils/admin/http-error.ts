import { toUserMessage } from "../toUserMessage";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  return toUserMessage(error, fallback);
};