import { isAxiosError } from "axios";

/**
 * Patterns that indicate a server-provided message is already user-friendly
 * and should be passed through as-is. These are checked case-insensitively.
 */
const USER_FRIENDLY_PATTERNS = [
  /already (registered|exists|in use)/i,
  /invalid (credentials|email|password|otp|token|format)/i,
  /not found/i,
  /email.*(required|taken|registered|format|not registered)/i,
  /password.*(required|mismatch|weak|short|incorrect|wrong)/i,
  /otp.*(expired|invalid|incorrect|required)/i,
  /account.*(locked|suspended|disabled|deactivated)/i,
  /session.*(expired|invalid)/i,
  /unauthorized/i,
  /forbidden/i,
  /too many/i,
  /rate limit/i,
  /file.*(too large|type|format|size)/i,
  /required/i,
  /must be/i,
  /cannot be/i,
  /please/i,
  /already/i,
  /duplicate/i,
  /verification/i,
];

/**
 * Technical error messages that should NEVER be shown to users.
 * These are Axios-generated defaults.
 */
const TECHNICAL_PATTERNS = [
  /^Request failed with status code \d+$/i,
  /^Network Error$/i,
  /^timeout of \d+ms exceeded$/i,
  /^ECONNABORTED$/i,
  /^ERR_NETWORK$/i,
  /^ERR_BAD_REQUEST$/i,
  /^ERR_BAD_RESPONSE$/i,
  /ER_DUP_ENTRY/i,
  /SQLITE_CONSTRAINT/i,
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /^connect ETIMEDOUT/i,
];

/** HTTP status code → user-friendly message */
const STATUS_MESSAGES: Record<number, string> = {
  400: "The request was invalid. Please check your input and try again.",
  401: "Invalid credentials. Please check your email and password.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  408: "The request took too long. Please try again.",
  409: "This action conflicts with existing data. Please refresh and try again.",
  413: "The file is too large. Please choose a smaller file.",
  422: "The submitted data is invalid. Please review your input.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "The server is temporarily unavailable. Please try again later.",
  503: "The service is temporarily unavailable. Please try again later.",
  504: "The server took too long to respond. Please try again later.",
};

function isTechnical(msg: string): boolean {
  return TECHNICAL_PATTERNS.some((p) => p.test(msg));
}

function isUserFriendly(msg: string): boolean {
  return USER_FRIENDLY_PATTERNS.some((p) => p.test(msg));
}

/**
 * Convert any caught error into a user-friendly message string.
 *
 * - Axios errors: checks for a user-friendly server message first,
 *   then falls back to a status-code-based message.
 * - Network / timeout errors: returns a connectivity-related message.
 * - Generic errors: passes through if user-friendly, else uses fallback.
 *
 * Raw error details are always logged to `console.error` for debugging.
 *
 * @param error   The caught error (unknown type)
 * @param fallback  A context-specific fallback like "Unable to save changes."
 */
export function toUserMessage(error: unknown, fallback: string): string {
  // Always log the raw error for debugging
  console.error("[Error]", error);

  if (isAxiosError(error)) {
    // Network / connectivity errors (no response received)
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }
    if (error.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }

    const status = error.response?.status;
    const data = error.response?.data as
      | { error?: string; message?: string; msg?: string }
      | undefined;

    // Extract the server-provided message
    const serverMsg = data?.error || data?.message || data?.msg;

    // For login endpoint specifically, treat 400 as invalid credentials
    if (status === 400 && serverMsg) {
      // If it's a validation error about email/password format, show it
      if (serverMsg.includes("Invalid email format") || serverMsg.includes("Password is required")) {
        return serverMsg;
      }
      // Otherwise, treat it as invalid credentials
      return "Invalid credentials. Please check your email and password.";
    }

    // If the server sent a user-friendly message, use it
    if (serverMsg && isUserFriendly(serverMsg) && !isTechnical(serverMsg)) {
      return serverMsg;
    }

    // Fall back to status-code-based message
    if (status && STATUS_MESSAGES[status]) {
      return STATUS_MESSAGES[status];
    }

    return fallback;
  }

  // Standard Error objects
  if (error instanceof Error) {
    const msg = error.message;

    // If it's a technical message, don't show it
    if (isTechnical(msg)) {
      return fallback;
    }

    // If it looks user-friendly, pass it through
    if (isUserFriendly(msg)) {
      return msg;
    }

    return fallback;
  }

  return fallback;
}
