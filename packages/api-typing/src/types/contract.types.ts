import z, { ZodType } from "zod";

export type DeepInfer<T> = {
  [K in keyof T]: T[K] extends z.ZodTypeAny
    ? z.infer<T[K]> // Case A: It's a Schema -> Infer it
    : T[K] extends Record<string, any>
      ? DeepInfer<T[K]> // Case B: It's a Namespace -> Go Deeper
      : never; // Case C: Helper functions/consts -> Hide
};

export type DeepInferSchema<T> = {
  [K in keyof T]: T[K] extends z.ZodTypeAny
    ? T[K] // Case A: It's a Schema -> Infer it
    : T[K] extends Record<string, any>
      ? DeepInferSchema<T[K]> // Case B: It's a Namespace -> Go Deeper
      : never; // Case C: Helper functions/consts -> Hide
};

export type ZodValidatorType = ZodType<any>;

// export type EndpointType = {
//   method: "GET" | "POST" | "PUT" | "DELETE";
//   request: {
//     params?: ZodValidatorType;
//     body?: ZodValidatorType;
//     query?: ZodValidatorType;
//   };
//   response: {
//     [statusCode: number]: ZodValidatorType;
//   };
// };

// export type RouteType = {
//   path: string;
//   routes: RoutesType;
// };

export class EndpointType {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "LIST" | "UPDATE" =
    "GET";
  request: {
    params?: ZodValidatorType;
    body?: ZodValidatorType;
    query?: ZodValidatorType;
  } = {};
  response: {
    [statusCode: number]: ZodValidatorType;
  } = {};
}
 

export class RouteType {
  path: string = "/";
  routes: {
    [routeName: string]: RouteType | EndpointType;
  } = {};
}

export type RoutesType = {
  [routeName: string]: RouteType | EndpointType;
};

type InferEndpoint <T extends EndpointType> = {
  method: T["method"];
  request: {
    [K in keyof T["request"] as T["request"][K] extends ZodType<any>
      ? K
      : never]: z.infer<NonNullable<T["request"][K]>>;
  }, 
  response: {
    [K in keyof T["response"]]:  T["response"][K] extends ZodType<any>
      ? z.infer<T["response"][K]>
      : never;
  };
}

export type ApiContract<T extends RouteType> = {
  [K in keyof T["routes"]]: T["routes"][K] extends RouteType
    ? ApiContract<T["routes"][K]> // Case B: It's a Namespace -> Go Deeper
    : T["routes"][K] extends EndpointType
      ? InferEndpoint<T["routes"][K]> // Case A: It's a Schema -> Infer it
      : never; // Case C: Helper functions/consts -> Hide
};

export type ApiTypes<T extends RouteType> = {
  [K in keyof T["routes"]]: T["routes"][K] extends RouteType
    ? ApiContract<T["routes"][K]> // Case B: It's a Namespace -> Go Deeper
    : T["routes"][K] extends EndpointType
      ? DeepInfer<T["routes"][K]> // Case A: It's a Schema -> Infer it
      : never; // Case C: Helper functions/consts -> Hide
};

export const createRoutes = <T extends RoutesType>(routes: T) => routes;

export const createRoute = <T extends RouteType>(route: T): T => {
  const newRoute = new RouteType();
  newRoute.path = route.path;
  newRoute.routes = route.routes;
  return newRoute as T;
  // return;
};

export const createEndpoint = <T extends EndpointType>(endpoint: T): T => {
  const newEndpoint = new EndpointType();
  newEndpoint.method = endpoint.method;
  newEndpoint.request = endpoint.request;
  newEndpoint.response = endpoint.response;
  return newEndpoint as T;
};


export type InferEndpointData<T extends EndpointType> = {
  method: T["method"];
  path: string; // Add path if you want frontend to know it
  request: {
    [K in keyof T["request"]]: T["request"][K] extends ZodType<any>
      ? z.infer<T["request"][K]>
      : never;
  };
  response: {
    [K in keyof T["response"]]: T["response"][K] extends ZodType<any>
      ? z.infer<T["response"][K]>
      : never;
  };
};

export type ClientContract<T> = {
  [K in keyof T]: T[K] extends EndpointType
    ? InferEndpointData<T[K]>
    : ClientContract<T[K]>;
};

export type ContractDefinition<T extends RouteType> = {
  [K in keyof T["routes"]]: T["routes"][K] extends RouteType
    ? ContractDefinition<T["routes"][K]> 
    : T["routes"][K] extends EndpointType
      ? T["routes"][K] // 👈 RETURN THE ENDPOINT (With Schemas), NOT THE INFERRED DATA
      : never;
};

export const createContract = <T extends RouteType>(
  rootRoute: T
): ContractDefinition<T> => {
  
  // Recursive helper that carries the 'currentPath' down the tree
  const buildContract = (route: RouteType, currentPath: string = ""): any => {
    const contract: any = {};
    
    // Clean path joining (handles slashes)
    const normalizePath = (p: string) => p.startsWith("/") ? p : `/${p}`;
    const segment = route.path === "/" ? "" : normalizePath(route.path);
    const fullPath = currentPath + segment;

    for (const [key, value] of Object.entries(route.routes)) {
      if ("routes" in value) {
        // It's a Route -> Recurse and pass the new path
        contract[key] = buildContract(value as RouteType, fullPath);
      } else {
        // It's an Endpoint -> Inject the Full Path!
        const endpoint = value as EndpointType;
        // We attach the computed path to the endpoint object
        (endpoint as any).path = fullPath; 
        contract[key] = endpoint;
      }
    }
    return contract;
  };
  return buildContract(rootRoute) as ContractDefinition<T>;
};

// export type ContractType<T extends RoutesType> = {
//   [K in keyof T]: T[K] extends RouteType
//     ? ContractType<T[K]["routes"]>
//     : T[K] extends EndpointType
//       ? T[K]
//       : never;
// };

// export const createContract = <T extends RoutesType>(
//   routes: T
// ): ContractType<T> => {
//   //
// };
