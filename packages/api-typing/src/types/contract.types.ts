import z, { ZodType } from "zod";

// ==========================================
// 1. CORE DEFINITIONS (The "Shape" of things)
// ==========================================

export type ZodValidator = ZodType<any>;

/**
 * Defines a single API Endpoint.
 */
export interface EndpointDef {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "LIST" | "UPDATE";
  request?: {
    params?: ZodValidator;
    body?: ZodValidator;
    query?: ZodValidator;
  };
  response: {
    [statusCode: number]: ZodValidator;
  };
}

/**
 * Defines a Route Node (which contains other Routes or Endpoints).
 */
export interface RouteDef {
  path: string;
  routes: Record<string, RouteDef | EndpointDef>;
}

// ==========================================
// 2. TYPE GUARDS (Safety checks)
// ==========================================

/**
 * Strict Type Guard to check if a node is an Endpoint.
 * Checks for the presence of 'method' and 'response'.
 */
export const isEndpoint = (node: any): node is EndpointDef => {
  return (
    typeof node === "object" &&
    node !== null &&
    "method" in node &&
    "response" in node &&
    !("routes" in node) // Key distinction: Endpoints don't have children
  );
};

/**
 * Strict Type Guard to check if a node is a Route.
 */
export const isRoute = (node: any): node is RouteDef => {
  return (
    typeof node === "object" &&
    node !== null &&
    "routes" in node &&
    "path" in node
  );
};

// ==========================================
// 3. FACTORIES (Strict Creation)
// ==========================================

/**
 * Utility: Enforces that T contains ONLY keys from Shape.
 * Extra keys become 'never', triggering a TS error.
 */
type Strict<T, Shape> = T & {
  [K in keyof T]: K extends keyof Shape ? T[K] : never;
};

/**
 * Creates a strictly typed Route.
 */
export const createRoute = <T extends RouteDef>(
  route: Strict<T, RouteDef>
): T => {
  return route as T;
};

/**
 * Creates a strictly typed Endpoint.
 */
export const createEndpoint = <T extends EndpointDef>(
  endpoint: Strict<T, EndpointDef>
): T => {
  return endpoint as T;
};

// ==========================================
// 4. INFERENCE & RECURSION (The Magic)
// ==========================================

/**
 * Extract TypeScript types (z.infer) from an Endpoint Definition.
 */
type InferEndpointData<T extends EndpointDef> = {
  method: T["method"];
  request: {
    [K in keyof T["request"]]: T["request"][K] extends ZodType
      ? z.infer<T["request"][K]>
      : never;
  };
  response: {
    [K in keyof T["response"]]: T["response"][K] extends ZodType
      ? z.infer<T["response"][K]>
      : never;
  };
};

/**
 * Recursively generates the Type Contract for the frontend.
 * (Converts Zod schemas -> TS types)
 */
export type ApiTypes<T extends RouteDef> = {
  [K in keyof T["routes"]]: T["routes"][K] extends RouteDef
    ? ApiTypes<T["routes"][K]> // Recurse
    : T["routes"][K] extends EndpointDef
    ? InferEndpointData<T["routes"][K]> // Infer
    : never;
};

/**
 * Recursively generates the Runtime Contract.
 * (Preserves Zod schemas, injects full paths)
 */
export type ContractDefinition<T extends RouteDef> = {
  [K in keyof T["routes"]]: T["routes"][K] extends RouteDef
    ? ContractDefinition<T["routes"][K]>
    : T["routes"][K] extends EndpointDef
    ? T["routes"][K] & { path: string } // Inject Path
    : never;
};

// ==========================================
// 5. CONTRACT BUILDER
// ==========================================

export const createContract = <T extends RouteDef>(
  rootRoute: T
): ContractDefinition<T> => {
  
  // Recursive function to walk the tree
  const walk = (node: RouteDef, parentPath: string): any => {
    const contract: Record<string, any> = {};

    // Normalize path joining
    const currentPathSegment = node.path === "/" ? "" : node.path;
    // Ensure we don't get double slashes unless it's root
    const fullPath = `${parentPath.replace(/\/$/, "")}/${currentPathSegment.replace(/^\//, "")}`;

    for (const [key, child] of Object.entries(node.routes)) {
      if (isRoute(child)) {
        // Case A: Nested Route -> Recurse
        contract[key] = walk(child, fullPath);
      } else if (isEndpoint(child)) {
        // Case B: Endpoint -> Inject Path & Assign
        contract[key] = {
          ...child,
          path: fullPath === "" ? "/" : fullPath,
        };
      }
    }
    return contract;
  };

  return walk(rootRoute, "") as ContractDefinition<T>;
};