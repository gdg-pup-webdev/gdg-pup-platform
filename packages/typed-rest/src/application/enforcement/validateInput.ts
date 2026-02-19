import {
  IncomingRequestValidationError,
  ParsingError,
} from "./domains/TypedRestError";

import { Contract, ValidatedInputObject } from "./domains/serverTypes";

type Request = {
  query?: any;
  params?: any;
  body?: any;
  files?: any;
};

export async function validateInput<T extends Contract>(
  req: Request,
  contract: T,
): Promise<ValidatedInputObject<T>> {
  let partialInputObject: Partial<ValidatedInputObject<T>> = {};

  // --- Query ---
  const queryContract = contract.request.query;
  if (queryContract) {
    const parseResult = await queryContract.safeParseAsync(req.query);
    if (parseResult.error) {
      throw new IncomingRequestValidationError(
        `Invalid query params: ${parseResult.error.message}`,
        parseResult.error,
      );
    }

    partialInputObject.query = parseResult.data;
  }

  // --- Params ---
  const paramsContract = contract.request.params;
  if (paramsContract) {
    const parseResult = await paramsContract.safeParseAsync(req.params);
    if (parseResult.error) {
      throw new IncomingRequestValidationError(
        `Invalid params params: ${parseResult.error.message}`,
        parseResult.error,
      );
    }

    partialInputObject.params = parseResult.data;
  }

  // --- FILES ---
  const filesContract = contract.request.files as T["request"]["files"];
  if (filesContract) {
    const fileContractKeys = Object.keys(filesContract) as Array<
      keyof typeof filesContract
    >;

    let rawFiles: any = {};

    // 3. Process File Fields
    if (req.files) {
      for (const fileKey of fileContractKeys) {
        const fieldSchema = filesContract[fileKey as any];
        const files = req.files[fileKey];

        if (Array.isArray(fieldSchema) && !Array.isArray(files)) {
          throw new ParsingError(
            `Expecting an array of file for request.files.${String(fileKey)} instead of a single file`,
          );
        }
        if (!Array.isArray(fieldSchema) && Array.isArray(files)) {
          throw new ParsingError(
            `Expecting a single file for request.files.${String(fileKey)} instead of an array`,
          );
        }

        rawFiles[fileKey as any] = files;
      }
    }

    partialInputObject.files = rawFiles as any;
  }

  // --- BODY ---
  const bodyContract = contract.request.body;
  if (bodyContract) {
    const parseResult = await bodyContract.safeParseAsync(req.body);
    if (parseResult.error) {
      throw new IncomingRequestValidationError(
        `Invalid body params: ${parseResult.error.message}`,
        parseResult.error,
      );
    }

    partialInputObject.body = parseResult.data;
  }

  return partialInputObject as ValidatedInputObject<T>;
}
