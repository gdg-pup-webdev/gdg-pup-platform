import { Request, RequestHandler, Response } from "express";
import z, { ZodType } from "zod"; 
import { EndpointType } from "./contract.types.js";
    
export type InferHandlerResult<T extends EndpointType> = {
  [K in keyof T["response"]]: {
    status: K; // The status code (e.g., 200)
    body: z.infer<T["response"][K]>; // The schema for that code
  };
}[keyof T["response"]];

export type InferRequestInput<T extends EndpointType> =
  // REQUIRED keys (schema exists)
  {
    [K in keyof T["request"] as T["request"][K] extends ZodType<any>
      ? K
      : never]: z.infer<NonNullable<T["request"][K]>>;
  } & {
    // FORBIDDEN keys (schema does not exist)
    [K in keyof T["request"] as T["request"][K] extends ZodType<any>
      ? never
      : K]?: never;
  };
export type ResponseSchemaOf<
  T extends EndpointType,
  S extends keyof T["response"],
> = z.infer<T["response"][S]>;
