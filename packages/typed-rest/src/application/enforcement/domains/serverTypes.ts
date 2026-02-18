
import { cz as z } from "#shared/index.js";

export type Contract = {
  path: string;
  method: string;

  request: {
    query?: z.ZodType<any>;
    params?: z.ZodType<any>;
    body?: z.ZodType<any>;
    files?: {
      [key: string]: z.ZodFile | z.ZodArray<z.ZodFile>;
    };
  };

  response: {
    [statusCode: number]: z.ZodType<any>;
  };
};

export type InputObjectFileKeyType<T extends Contract> = {
  [F in keyof T["request"]["files"]]: T["request"]["files"][F] extends z.ZodArray<z.ZodFile>
    ? File[]
    : File | undefined;
};

export type ValidatedInputObject<T extends Contract> = {
  [K in keyof T["request"]]: K extends "files"
    ? InputObjectFileKeyType<T>
    : z.infer<T["request"][K]>;
};

export type ContractResponseStatus<T extends Contract> = Extract<
  keyof T["response"],
  number
>;

export type ValidatedOutputObject<T extends Contract, S extends ContractResponseStatus<T>> = {
  status: S;
  body: z.infer<T["response"][S]>;
};
