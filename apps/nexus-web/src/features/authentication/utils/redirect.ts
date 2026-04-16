import { LINKS } from "@/lib/constants/links";

const APP_ORIGIN = "https://nexus.local";

export function normalizeRedirectTarget(raw: string | null): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  const decoded = safeDecode(trimmed);

  if (!decoded.startsWith("/") || decoded.startsWith("//")) {
    return null;
  }

  try {
    const parsed = new URL(decoded, APP_ORIGIN);
    if (parsed.origin !== APP_ORIGIN) {
      return null;
    }

    if (parsed.pathname.startsWith("/auth/callback")) {
      return null;
    }

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function resolvePostAuthTarget({
  next,
  callbackUrl,
  isOnboarded,
}: {
  next?: string | null;
  callbackUrl?: string | null;
  isOnboarded?: boolean;
}): string {
  const preferredTarget =
    normalizeRedirectTarget(next ?? null) ??
    normalizeRedirectTarget(callbackUrl ?? null);

  if (preferredTarget) {
    return preferredTarget;
  }

  if (isOnboarded === false) {
    return LINKS.onboarding;
  }

  return LINKS.sparkmates_me;
}

export function resolvePostLogoutTarget(raw: string | null): string {
  return normalizeRedirectTarget(raw) ?? LINKS.auth_signin;
}
