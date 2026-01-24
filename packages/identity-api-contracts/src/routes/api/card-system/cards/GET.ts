import { card } from "#models/cardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId : z.string().optional(),
  status : z.enum(["READY", "ACTIVATED", "INACTIVE"]).optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(card.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_query = {
    pageNumber : "Page number",
    pageSize : "Page size",
    userId : "User ID",
    status : "Card status",
}

export const docs_description =
  "List cards. Can be filtered by user_id and status.";
export const docs_summary = "List cards";
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request";
