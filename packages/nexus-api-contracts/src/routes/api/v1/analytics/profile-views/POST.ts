import {
  ProfileViewRecord,
  ProfileViewRecordInsertDTO,
} from "#models/v1/analytics/profileView.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  ProfileViewRecordInsertDTO,
);

export const response = {
  201: OpenApiSchemas.Response.single(ProfileViewRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Record a profile view";
export const docs_description = "Creates a new record for a profile view event.";
