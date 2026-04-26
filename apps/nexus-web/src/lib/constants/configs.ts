export const configs = {
    nexusApiBaseUrl: process.env.NEXT_PUBLIC_NEXUS_API_URL || "http://localhost:8000",
    env: {
        development: process.env.NEXT_PUBLIC_DEVELOPMENT === "true",
    }
}