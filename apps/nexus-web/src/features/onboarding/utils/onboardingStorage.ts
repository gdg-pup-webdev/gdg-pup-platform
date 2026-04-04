export const getOnboardingStorageKey = (gdgId: string) =>
  `onboarding:completed:${gdgId}`;

export const isOnboardingCompleted = (gdgId: string): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(getOnboardingStorageKey(gdgId)) === "1";
};

export const markOnboardingCompleted = (gdgId: string): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getOnboardingStorageKey(gdgId), "1");
};

export const saveOnboardingDraft = (gdgId: string, payload: unknown): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    `onboarding:draft:${gdgId}`,
    JSON.stringify(payload),
  );
};
