import { z, ZodError, ZodType } from "zod";
import {
  Request,
  RequestHandler as importRequestHandler,
  Response,
} from "express";
// ==========================================
// 1. CORE DEFINITIONS (The "Shape" of things)
// ==========================================

export type ZodValidator = ZodType<any>;

/**
 * Defines a single API Endpoint.
 */
export interface EndpointDef {
  request?: {
    params?: ZodValidator;
    body?: ZodValidator;
    query?: ZodValidator;
  };
  response: {
    [statusCode: number]: ZodValidator;
  };
  metadata: { signature: string; method: string; path: string } & Record<
    string,
    string
  >;
}

export type RequestHandler = importRequestHandler;

// --- Custom Errors ---

export class ContractError extends Error {
  public blame: "client" | "server";
  constructor(
    public error: ZodError,
    blame: "client" | "server"
  ) {
    super("Request validation failed");
    this.name = "Contract validation error";
    this.blame = blame;
  }
}

export type inferRequest<T extends EndpointDef> = {
  [K in keyof T["request"]]: z.infer<T["request"][K]>;
};

export type inferResponse<T extends EndpointDef> = {
  [K in keyof T["response"]]: z.infer<T["response"][K]>;
};

export type InferHandlerResult<T extends EndpointDef> = {
  [S in keyof T["response"]]: {
    status: S;
    body: inferResponse<T>[S];
  };
}[keyof T["response"]];

export type inferOutputFunction<T extends EndpointDef> = <
  S extends keyof T["response"],
>(
  status: S,
  body: inferResponse<T>[S]
) => { status: S; body: inferResponse<T>[S] };

export type inferContext<T extends EndpointDef> = {
  req: Request;
  res: Response;
};
