import { EndpointType } from "@/types/contract.types.js";
import {
  InferHandlerResult,
  InferRequestInput,
} from "@/types/enforcer.type.js";
import z from "zod";

// Helper: Extra options like Auth
type FetchOptions = Omit<RequestInit, "body" | "method"> & {
  token?: string; // Helper for "Authorization: Bearer <token>"
};

// Helper: Combine Zod Inputs + Fetch Options
type ClientArgs<T extends EndpointType> = InferRequestInput<T> & FetchOptions;

export const callEndpoint = async <T extends EndpointType>(
  baseUrl: string,
  endpoint: T,
  args: ClientArgs<T>
): Promise<InferHandlerResult<T>> => {
  // 1. Destructure args to separate API data from Fetch config
  const { body, query, params, token, headers, ...customConfig } = args as any;

  // 2. Get the path injected by createContract
  let urlPath = (endpoint as any).path as string;

  if (!urlPath) {
    throw new Error("Endpoint path is missing. Did you use createContract?");
  }

  // 3. Replace Path Params (e.g. /users/:userId -> /users/123)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      urlPath = urlPath.replace(`:${key}`, String(value));
    });
  }

  // 4. Construct Query String
  const url = new URL(urlPath, baseUrl);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // 5. Prepare Headers
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // 6. Execute Request
  const response = await fetch(url.toString(), {
    method: endpoint.method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...customConfig,
  });

  // 7. Handle Response
  let responseBody = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    responseBody = await response.json();
  }

  // OPTIONAL: Runtime Validation of Response
  // This ensures the backend actually sent what the contract promised.
  // const schema = endpoint.response[response.status];
  // if (schema) {
  //   responseBody = schema.parse(responseBody);
  // }

  // 8. Return Typed Result
  return {
    status: response.status,
    body: responseBody,
  } as InferHandlerResult<T>;
};
