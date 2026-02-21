const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

const inferCloudRunUrl = (servicePrefix: "nexus-api" | "identity-api") => {
  if (typeof window === "undefined") return null;
  const host = window.location.host;

  if (!host.includes(".run.app") || !host.startsWith("nexus-web-")) return null;

  const targetHost = host.replace(/^nexus-web-/, `${servicePrefix}-`);
  return `${window.location.protocol}//${targetHost}`;
};

const getSafeUrl = (envUrl: string | undefined, fallback: string) => {
  const normalizedEnv = envUrl ? trimTrailingSlash(envUrl) : "";

  if (typeof window !== "undefined") {
    const inferredNexus = inferCloudRunUrl("nexus-api");
    const inferredIdentity = inferCloudRunUrl("identity-api");

    if (window.location.host.includes(".run.app") && normalizedEnv.includes("localhost")) {
      if (fallback.includes("8000") && inferredNexus) return inferredNexus;
      if (fallback.includes("8100") && inferredIdentity) return inferredIdentity;
    }
  }

  return normalizedEnv || trimTrailingSlash(fallback);
};

export const configs = {
  nexusApiBaseUrl: getSafeUrl(process.env.NEXT_PUBLIC_NEXUS_API_URL, "http://localhost:8000"),
  identityApiBaseUrl: getSafeUrl(process.env.NEXT_PUBLIC_IDENTITY_API_URL, "http://localhost:8100"),
};
