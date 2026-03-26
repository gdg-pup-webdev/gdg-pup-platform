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

  // Case 1: Simple message property
  if (typeof errorBody.message === "string") return errorBody.message;

  // Case 2: Highly nested errors from the provided example
  // body.errors[0].errors[0].detail
  try {
    const firstLevelError = errorBody.errors?.[0];
    if (firstLevelError) {
      // If the first level has its own errors array (like the example provided)
      const secondLevelError = firstLevelError.errors?.[0];
      if (secondLevelError?.detail) return secondLevelError.detail;
      
      // Fallback to title of the first level error
      if (firstLevelError.title) return firstLevelError.title;
    }
  } catch (e) {
    // ignore parsing errors
  }

  // Case 3: Standard error list structure { errors: [ { detail: string } ] }
  if (Array.isArray(errorBody.errors) && errorBody.errors[0]?.detail) {
    return errorBody.errors[0].detail;
  }

  return defaultMessage;
}
