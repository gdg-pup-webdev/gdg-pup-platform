/**
 * Cleans a string by replacing non-alphanumeric characters with underscores
 * and preventing consecutive underscores.
 */
export function sanitizeToIdentifier(str: string): string {
  return (
    str
      // 1. Replace all non-alphanumeric characters with '_'
      .replace(/[^a-zA-Z0-9]/g, "_")
      // 2. Replace multiple consecutive underscores with a single '_'
      .replace(/_{2,}/g, "_")
      // 3. Optional: Remove leading or trailing underscores
      .replace(/^_+|_+$/g, "")
  );
}

export const segmentIsPathParameter = (segment: string) =>
  segment.startsWith("[") && segment.endsWith("]");

export function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * @deprecated
 */
export const stringIsCodeBlock_DEPRECATED = (str: string) =>
  str.startsWith("__CODE_START__") && str.endsWith("__CODE_END__");
