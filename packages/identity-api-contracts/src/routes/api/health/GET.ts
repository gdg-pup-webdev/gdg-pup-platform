import { getResponseModel } from "#models/response.model.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const response = {
  200: getResponseModel,
  500: SchemaFactory.Response.error(),
};
