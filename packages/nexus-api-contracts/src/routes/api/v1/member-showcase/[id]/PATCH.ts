import {
  memberShowcaseRecord,
  memberShowcaseRecordUpdateDTO,
} from "#models/v1/memberShowcase/memberShowcase.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const files = {
  thumbnailFile: OpenApiSchemas.Models.file() ,
};

export const body = OpenApiSchemas.Request.Body.withPayload(memberShowcaseRecordUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(memberShowcaseRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update member showcase";
export const docs_description = "Updates an existing member showcase.";
