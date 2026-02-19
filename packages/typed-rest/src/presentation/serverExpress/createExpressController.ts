import { convertMulterFile } from "#presentation/serverExpress/convertMulterFile.js";
import {
  Contract,
  ValidatedInputObject,
} from "#application/enforcement/domains/serverTypes.js";
import { OutputFunction } from "./types";
import { Handler } from "./types";
import { validateInput } from "#application/enforcement/validateInput.js";
import { validateOutput } from "#application/enforcement/validateOutput.js";
import { RequestHandler } from "express";
import multer from "multer";
import { cz as z } from "#shared/index.js";

export const createExpressController = <T extends Contract>(
  contract: T,
  handler: Handler<T>,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const request = {
        query: req.query,
        params: req.params,
        body: {} as any,
        files: {} as any,
      };

      console.log("this is request params", req.params);

      if (contract.request.files) {
        const filesContract = contract.request.files;
        const bodyContract = contract.request.body;

        if (!(bodyContract instanceof z.ZodObject)) {
          throw new Error(
            "Request is a multipart form containing files. Body MUST be an object.",
          );
        }

        const fileContractKeys = Object.keys(filesContract) as Array<
          keyof typeof filesContract
        >;

        // 1. parse files
        const storage = multer.memoryStorage();
        const upload = multer({ storage }).fields(
          fileContractKeys.map((key) => ({ name: key as string })),
        );

        await new Promise<void>((resolve, reject) => {
          upload(req, res, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });

        // 2. Process Text Fields (Multipart forms send everything as strings)
        const bodyContractKeys = Object.keys(bodyContract.shape) as Array<
          keyof z.infer<T["request"]["body"]>
        >;

        for (const key of bodyContractKeys) {
          const value = req.body[key];

          if (!value) {
            throw new Error(
              `Expecting body field ${String(key)} to be present in request body.`,
            );
          }

          if (typeof value !== "string") {
            throw new Error(
              `Request is a multipart form containing files. Expecting a string for body field ${String(key)}.`,
            );
          }

          try {
            const objectifiedBody = JSON.parse(value);

            request.body[key] = objectifiedBody;
          } catch (e) {
            throw new Error(
              `Unable to parse key ${String(key)} as JSON of multipart request body. Value is: ${value}.`,
            );
          }
        }

        // 3. Process File Fields
        if (req.files) {
          if (Array.isArray(req.files)) {
            throw new Error(
              `Parsed req.files is an array, but it should be an object with file keys. Length: ${req.files.length}`,
            );
          }

          for (const fileKey of fileContractKeys) {
            const files = req.files[fileKey];
            if (files && files.length > 0) {
              const fileFieldContract = filesContract[fileKey as any];
              const convertedFiles = files.map(convertMulterFile);

              if (Array.isArray(fileFieldContract)) {
                request.files[fileKey as any] = convertedFiles;
              } else {
                request.files[fileKey as any] = convertedFiles[0];
              }
            }
          }
        }
      }

      // parse body
      // console.log("hello?", req.body);
      if (!contract.request.files && req.body) {
        // console.log("djfalskdfjalkdfjadklfjadlkf", JSON.stringify(req.body));
        request.body = req.body;
      }

      let parsedInput: ValidatedInputObject<T> = await validateInput(
        request,
        contract,
      );

      const output: OutputFunction<T> = (status, body) => {
        return { status, body };
      };

      const result = await handler({
        input: parsedInput,
        ctx: { req, res },
        output,
      });

      const parsedOutput = await validateOutput(result, contract);

      res.status(parsedOutput.status).json(parsedOutput.body);
    } catch (error) {
      next(error);
    }
  };
};
