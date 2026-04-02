import { resendOtpRequest, resendOtpResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(resendOtpRequest);

export const response = {
  200: OpenApiSchemas.Response.single(resendOtpResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Resend OTP";
export const docs_description = "Resends a new OTP for the given reference code and updates it.";
