import { EndpointDef } from "@/types/contract.types.js";
import {
  InferRequestInput,
  InferHandlerResult,
} from "@/types/enforcer.type.js";

// Helper: Extra options like Auth
type FetchOptions = Omit<RequestInit, "body" | "method"> & {
  token?: string; // Helper for "Authorization: Bearer <token>"
};

// Helper: Combine Zod Inputs + Fetch Options
// We use a conditional type here: if InferRequestInput<T> is empty, we don't force it.
type ClientArgs<T extends EndpointDef> =
  keyof InferRequestInput<T> extends never
    ? FetchOptions
    : InferRequestInput<T> & FetchOptions;

/**
 * USAGE
    const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        Contract.health.get,
        {}
      );

      if (result.status === 200) {
        result; // fully types using status 200
      }
 */
export const callEndpoint = async <T extends EndpointDef>(
  baseUrl: string,
  endpoint: T,
  args: ClientArgs<T>
): Promise<InferHandlerResult<T>> => {
  // 1. Destructure args. We use 'any' safely here because the generic 'ClientArgs<T>'
  //    has already enforced the shape at the call-site.
  const { body, query, params, token, headers, ...customConfig } = args as any;

  // 2. Get the path.
  // CRITICAL: The 'path' property is injected by 'createContract'.
  // If you pass a raw object from 'createEndpoint', this will be missing.
  // Use the 'Contract' object exported from your routes file.
  let urlPath = (endpoint as any).path as string;

  if (!urlPath) {
    // Fallback: If path isn't injected, try to find it (rare case) or throw
    throw new Error(
      `Endpoint path is missing for method ${endpoint.method}. Ensure you are using the 'Contract' object, not the raw route definition.`
    );
  }

  // 3. Replace Path Params (e.g. /users/:userId -> /users/123)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      // We encode URI component to handle special characters in IDs
      urlPath = urlPath.replace(`:${key}`, encodeURIComponent(String(value)));
    });
  }

  // Check for missing params (optional safety check)
  if (urlPath.includes(":")) {
    console.warn(
      `[ApiClient] Warning: URL ${urlPath} still contains ':' placeholders. Missing params?`
    );
  }

  // 4. Construct Query String
  // We handle the base URL carefully to avoid double slashes
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanPath = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;

  const url = new URL(cleanBase + cleanPath);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle arrays in query (e.g. ?ids=1&ids=2)
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
  }

  // 5. Prepare Headers
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Merge user-provided headers, casting to allow string indexing
    ...(headers as Record<string, string>),
  };

  // 6. Execute Request
  try {
    const response = await fetch(url.toString(), {
      method: endpoint.method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...customConfig,
    });

    // 7. Handle Response Body
    let responseBody = null;
    const contentType = response.headers.get("content-type");

    // Safely attempt to parse JSON, fallback to text if needed
    if (contentType && contentType.includes("application/json")) {
      // Handle empty bodies (204 No Content)
      const text = await response.text();
      responseBody = text ? JSON.parse(text) : null;
    }

    // 8. Return Typed Result
    // The cast to InferHandlerResult<T> tells TS:
    // "Trust me, the server obeyed the contract we share."
    return {
      status: response.status,
      body: responseBody,
    } as InferHandlerResult<T>;
  } catch (err) {
    // Handle network errors (fetch failed entirely)
    throw err;
  }
};
