import { file } from "#models/fileSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";


export const body = SchemaFactory.Request.withPayload(file.insert);

export const response = {
    200: SchemaFactory.Response.single(file.row),
    ...SchemaFactory.Response.standardErrors(),
  
}
