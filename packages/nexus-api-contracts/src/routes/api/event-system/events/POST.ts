import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js"; 
import z from "zod";

export const body = SchemaFactory.Request.withPayload(event.insertDTO);
 

export const response = {
  200: SchemaFactory.Response.single(event.row),
  ...SchemaFactory.Response.standardErrors(),
};
