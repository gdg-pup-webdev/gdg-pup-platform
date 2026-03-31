import { verifyTokenRequest, verifyTokenResponse } from "#models/v1/authentication/index.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";


export const body = OpenApiSchemas.Request.Body.withPayload(verifyTokenRequest);

export const response = {
  200: OpenApiSchemas.Response.single(cz.string()),
  ...OpenApiSchemas.Response.standardErrors(),
};
