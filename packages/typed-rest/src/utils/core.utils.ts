/**
 * Cleans a string by replacing non-alphanumeric characters with underscores
 * and preventing consecutive underscores.
 */import crypto from "crypto";
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


export function generateDeterministicID(input: string, length = 16): string {
  // sha256 provides 32 bytes of data
  const hash = crypto.createHash("sha256").update(input).digest();
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < length; i++) {
    // 1. Get the byte safely. 
    // 2. We use % 32 to "wrap around" if length > 32 (prevents undefined)
    const byte = hash[i % hash.length]; 
    
    // The '!' tells TS we know this exists, or use '?? 0'
    result += alphabet[byte! % alphabet.length];
  }

  return result;
}