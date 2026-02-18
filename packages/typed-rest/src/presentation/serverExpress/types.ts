import {
  Contract,
  ValidatedInputObject,
  ContractResponseStatus,
  ValidatedOutputObject,
} from "#application/enforcement/domains/serverTypes.js";
import { Request, Response } from "express";
import { cz as z } from "#shared/index.js";

export type Handler<T extends Contract> = (
  params: HandlerParams<T>,
) => HandlerOutput<T>;

export type HandlerParams<T extends Contract> = {
  input: ValidatedInputObject<T>;
  ctx: ContextObject;
  output: OutputFunction<T>;
};

export type HandlerOutput<T extends Contract> = Promise<
  {
    [S in ContractResponseStatus<T>]: {
      status: S;
      body: z.infer<T["response"][S]>;
    };
  }[ContractResponseStatus<T>]
>;

export type ContextObject = {
  req: Request;
  res: Response;
};

export type OutputFunction<T extends Contract> = <
  S extends ContractResponseStatus<T>,
>(
  status: S,
  body: z.infer<T["response"][S]>,
) => ValidatedOutputObject<T, S>;
