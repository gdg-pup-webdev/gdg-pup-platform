
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const response = {
  200: SchemaFactory.Response.empty(),
  500: SchemaFactory.Response.error(),
};
