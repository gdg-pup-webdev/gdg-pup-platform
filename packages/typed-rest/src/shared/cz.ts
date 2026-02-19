/**
 * @file cz.ts
 * - export extended zod instance
 */

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import * as cz from "zod";

extendZodWithOpenApi(cz);

export { cz, OpenAPIRegistry, OpenApiGeneratorV3 };
