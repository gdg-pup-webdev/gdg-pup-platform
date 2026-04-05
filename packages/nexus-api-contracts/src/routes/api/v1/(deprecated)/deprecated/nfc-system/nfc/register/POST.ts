import {
  nfcCardRegisterPayload,
  nfcCardRegisterResponse,
} from "#models/v1/portfolioSystem/sparkmates.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  nfcCardRegisterPayload,
);

export const response = {
  201: OpenApiSchemas.Response.single(nfcCardRegisterResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Register NFC card";
export const docs_description = [
  "Purpose: Register an NFC card for a member using gdg_id.",
  "Inputs: Body with gdg_id and optional owner_user_id and notes.",
  "Outputs: Created NFC card registration record in issued status.",
  "Errors: 400, 401, 404, 409, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
