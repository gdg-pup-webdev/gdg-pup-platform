 import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js"


export const query =  SchemaFactory.Request.Paginated.query()


export const response = {
        200: SchemaFactory.Response.paginated( event.row),
        ...SchemaFactory.Response.standardErrors(),
      }