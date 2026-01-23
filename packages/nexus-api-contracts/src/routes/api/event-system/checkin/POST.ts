import { attendance, checkin } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(checkin.insertDTO);

export const response = {
  200: SchemaFactory.Response.single(attendance.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_description = "this is the path for economy transactions";
export const docs_summary = "this is the summary";
export const docs_body = "this is the body";
export const docs_response_200 = "galing";
export const docs_response_400 = "bad request agoi";
