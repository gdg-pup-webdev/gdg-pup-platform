"use client";
export function getLinkHostname(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "Custom Link";
  }
}
