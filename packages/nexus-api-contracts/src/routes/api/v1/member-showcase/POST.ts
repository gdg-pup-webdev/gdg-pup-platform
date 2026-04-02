import {
  memberShowcaseRecord,
  memberShowcaseRecordInsertDTO,
} from "#models/v1/memberShowcase/memberShowcase.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const files = {
  thumbnailFile: OpenApiSchemas.Models.file(),
};

export const body = OpenApiSchemas.Request.Body.withPayload(memberShowcaseRecordInsertDTO);

export const response = {
  201: OpenApiSchemas.Response.single(memberShowcaseRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create member showcase";
export const docs_description = "Creates a new member showcase with a thumbnail file.";
