// create a new study jam 
// side effects: 
// - create a new event and attatch it to this study jam 
// 
// todo: 
// - remove the reference id on event model. Resources must reference its event, not the other way around
//
//
//
 import { studyJam } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  studyJam.insert
);

export const response = {
  200: SchemaFactory.Response.single(studyJam.row),
  ...SchemaFactory.Response.standardErrors(),
};
