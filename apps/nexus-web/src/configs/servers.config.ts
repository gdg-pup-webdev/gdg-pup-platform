export const configs = {
  nexusApiBaseUrl:
    process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000/",
  identityApiBaseUrl:
    process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:8100/",
};
