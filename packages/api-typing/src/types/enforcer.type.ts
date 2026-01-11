import { Request, RequestHandler, Response } from "express";
import z, { ZodType } from "zod"; 
import { EndpointDef } from "./contract.types.js";
    
// export type InferHandlerResult<T extends EndpointDef> = {
//   [K in keyof T["response"]]: {
//     status: K; // The status code (e.g., 200)
//     body: z.infer<T["response"][K]>; // The schema for that code
//   };
// }[keyof T["response"]];

// export type InferRequestInput<T extends EndpointDef> =
//   // REQUIRED keys (schema exists)
//   {
//     [K in keyof T["request"] as T["request"][K] extends ZodType<any>
//       ? K
//       : never]: z.infer<NonNullable<T["request"][K]>>;
//   } & {
//     // FORBIDDEN keys (schema does not exist)
//     [K in keyof T["request"] as T["request"][K] extends ZodType<any>
//       ? never
//       : K]?: never;
//   };
// export type ResponseSchemaOf<
//   T extends EndpointDef,
//   S extends keyof T["response"],
// > = z.infer<T["response"][S]>;



// 1. Get the Body Type for a specific Status Code (e.g., 200 -> User)
export type ResponseSchemaOf<T extends EndpointDef, S extends keyof T["response"]> =
  T["response"][S] extends ZodType
    ? z.infer<T["response"][S]>
    : never;

// 2. Construct the Input Object (Query + Params + Body)
// This uses conditional types to only add keys if they exist in the Zod schema
export type InferRequestInput<T extends EndpointDef> = 
  (T["request"] extends { query: ZodType } ? { query: z.infer<T["request"]["query"]> } : {}) &
  (T["request"] extends { params: ZodType } ? { params: z.infer<T["request"]["params"]> } : {}) &
  (T["request"] extends { body: ZodType } ? { body: z.infer<T["request"]["body"]> } : {});

// 3. Define what the Handler MUST return
// This creates a Union Type of all possible responses defined in the contract
// Example: { status: 200, body: User } | { status: 404, body: Error }
export type InferHandlerResult<T extends EndpointDef> = {
  [S in keyof T["response"]]: {
    status: S;
    body: ResponseSchemaOf<T, S>;
  };
}[keyof T["response"]];