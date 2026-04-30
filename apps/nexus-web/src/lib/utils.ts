import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formatDate(date:Date) {
  const days = String(date.getDate()).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours: string | number = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = String(hours % 12 || 12).padStart(2, '0');

  return `${days}, ${month} ${year} . ${hours}:${minutes} ${ampm}`;
}


 
/**
 * Extracts a user-friendly error message from a potentially nested API error response.
 * Handles standard { message: string } and nested { errors: [ { errors: [ { detail: string } ] } ] } structures.
 */
export function extractErrorMessage(errorBody: any, defaultMessage = "An unexpected error occurred"): string {
  if (!errorBody) return defaultMessage;

  const rawMessage = getPrimaryErrorMessage(errorBody);
  return rawMessage || defaultMessage;
}

type AuthErrorContext =
  | "login"
  | "forgot-password-initiate"
  | "forgot-password-finalize"
  | "signup-initiate"
  | "signup-finalize"
  | "resend-otp"
  | "change-password-initiate"
  | "change-password-finalize";

const getPrimaryErrorMessage = (errorBody: any): string => {
  if (!errorBody) return "";

  // Case 1: Simple message property
  if (typeof errorBody.message === "string") return errorBody.message;

  // Case 2: Highly nested errors from the provided example
  // body.errors[0].errors[0].detail
  try {
    const firstLevelError = errorBody.errors?.[0];
    if (firstLevelError) {
      const secondLevelError = firstLevelError.errors?.[0];
      if (secondLevelError?.detail) return secondLevelError.detail;

      if (firstLevelError.title) return firstLevelError.title;
    }
  } catch (e) {
    // ignore parsing errors
  }

  // Case 3: Standard error list structure { errors: [ { detail: string } ] }
  if (Array.isArray(errorBody.errors) && errorBody.errors[0]?.detail) {
    return errorBody.errors[0].detail;
  }

  return "";
};

const isRateLimitMessage = (message: string) => {
  const normalized = message.toLowerCase();
  return normalized.includes("too many") || normalized.includes("rate limit");
};

export function extractAuthErrorMessage(
  errorBody: any,
  context: AuthErrorContext,
  defaultMessage = "Something went wrong. Please try again."
): string {
  const rawMessage = getPrimaryErrorMessage(errorBody).trim();
  const normalized = rawMessage.toLowerCase();
  const hasMessage = rawMessage.length > 0 && normalized !== "http error";

  if (hasMessage && isRateLimitMessage(rawMessage)) {
    return "Too many attempts. Please try again later.";
  }

  switch (context) {
    case "login":
      return "Incorrect email or password.";
    case "forgot-password-initiate":
      return "If an account exists for this email, you will receive a reset code.";
    case "forgot-password-finalize":
      return hasMessage ? rawMessage : "Unable to reset your password. Please try again.";
    case "signup-initiate":
      return hasMessage ? rawMessage : "Unable to start signup. Please try again.";
    case "signup-finalize":
      return hasMessage ? rawMessage : "Unable to verify the code. Please try again.";
    case "resend-otp":
      return hasMessage ? rawMessage : "Unable to resend the code right now. Please try again.";
    case "change-password-initiate":
      return hasMessage ? rawMessage : "Unable to start password change. Please try again.";
    case "change-password-finalize":
      return hasMessage ? rawMessage : "Unable to update your password. Please try again.";
    default:
      return hasMessage ? rawMessage : defaultMessage;
  }
}
