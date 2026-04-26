const resolveEnvironmentFromHost = (hostname: string) => {
    if (hostname.endsWith("admin.dev.gdgpup.org") || hostname.endsWith("dev.gdgpup.org")) {
        return "dev";
    }

    if (hostname.endsWith("admin.staging.gdgpup.org") || hostname.endsWith("staging.gdgpup.org")) {
        return "staging";
    }

    if (hostname.endsWith("admin.gdgpup.org") || hostname.endsWith("gdgpup.org")) {
        return "prod";
    }

    return null;
};

const getHostBasedApiBaseUrl = () => {
    if (typeof window === "undefined") {
        return null;
    }

    const env = resolveEnvironmentFromHost(window.location.hostname);

    if (env === "dev") {
        return "https://api.dev.gdgpup.org";
    }

    if (env === "staging") {
        return "https://api.staging.gdgpup.org";
    }

    if (env === "prod") {
        return "https://api.gdgpup.org";
    }

    return null;
};

const getHostBasedIdentityApiBaseUrl = () => {
    if (typeof window === "undefined") {
        return null;
    }

    const env = resolveEnvironmentFromHost(window.location.hostname);

    if (env === "dev") {
        return "https://identity.dev.gdgpup.org";
    }

    if (env === "staging") {
        return "https://identity.staging.gdgpup.org";
    }

    if (env === "prod") {
        return "https://identity.gdgpup.org";
    }

    return null;
};

export const configs = {
    nexusApiBaseUrl:
        process.env.NEXT_PUBLIC_NEXUS_API_URL ||
        getHostBasedApiBaseUrl() ||
        "http://localhost:8000",
    identityApiBaseUrl:
        process.env.NEXT_PUBLIC_IDENTITY_API_URL ||
        getHostBasedIdentityApiBaseUrl() ||
        "http://localhost:8100",
};