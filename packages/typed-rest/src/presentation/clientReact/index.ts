import {
  Contract,
  ValidatedInputObject,
} from "#application/enforcement/domains/serverTypes.js";
import { HandlerOutput } from "#presentation/serverExpress/types.js";

// Helper: Extra options like Auth
type FetchOptions = Omit<RequestInit, "body" | "method"> & {
  token?: string; // Helper for "Authorization: Bearer <token>"
};

type ClientArgs<T extends Contract> = ValidatedInputObject<T> & FetchOptions;

/**
 */
export const callEndpoint = async <T extends Contract>(
  baseUrl: string,
  endpoint: T,
  args: ClientArgs<T>,
): HandlerOutput<T> => {
  const { token, headers, ...customConfig } = args;

  let urlPath = endpoint.path;

  if (args.params) {
    Object.entries(args.params).forEach(([key, value]) => {
      // We encode URI component to handle special characters in IDs
      urlPath = urlPath.replace(`[${key}]`, encodeURIComponent(String(value)));
    });
  }

  // 4. Construct Query String
  // We handle the base URL carefully to avoid double slashes
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanPath = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;

  const url = new URL(cleanBase + cleanPath);

  if (args.query) {
    Object.entries(args.query).forEach(([key, value]) => {
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
  let requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Merge user-provided headers, casting to allow string indexing
    ...(headers as Record<string, string>),
  };

  // process body
  let processedBody = null;
  if (endpoint.request.files) {
    // remove content type from header. it defaults to "application/json"
    const { "Content-Type": noContentTypeHeader, ...restOfHeader } =
      requestHeaders;
    requestHeaders = restOfHeader;

    const formData = new FormData();
    if (args.body) {
      Object.entries(args.body).forEach(([key, value]) => {
        formData.append(
          key,
          value instanceof File
            ? value
            : Array.isArray(value) && value instanceof File
              ? value
              : JSON.stringify(value),
        );
      });
    }
    processedBody = formData;
  }

  if (args.body && !endpoint.request.files) {
    processedBody = JSON.stringify(args.body);
  }

  if (endpoint.request.body && !processedBody)
    throw new Error("Request body is undefined");

  // 6. Execute Request
  try {
    const response = await fetch(url.toString(), {
      method: endpoint.method,
      headers: requestHeaders,
      body: endpoint.request.body ? processedBody : undefined,
      ...customConfig,
    });

    // 7. Handle Response Body
    let responseBody = null;
    const contentType = response.headers.get("content-type");

    // // Safely attempt to parse JSON, fallback to text if needed
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      responseBody = text ? JSON.parse(text) : null;
    } else {
      responseBody = await response.text();
    }

    return {
      status: response.status,
      body: responseBody,
    } as unknown as HandlerOutput<T>;
  } catch (err) {
    throw err;
  }
};
