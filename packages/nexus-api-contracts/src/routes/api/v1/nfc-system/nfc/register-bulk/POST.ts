import {
  nfcCardRegisterBulkPayload,
  nfcCardRegisterBulkResponse,
} from "#models/v1/portfolioSystem/sparkmates.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  nfcCardRegisterBulkPayload,
);

export const response = {
  200: OpenApiSchemas.Response.single(nfcCardRegisterBulkResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Register NFC cards in bulk";
export const docs_description = [
  "Purpose: Register multiple NFC cards in one request.",
  "Inputs: Body with cards array containing gdg_id and optional owner_user_id and notes.",
  "Outputs: Registered cards and per-item failures.",
  "Errors: 400, 401, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
