import {
  PointsOperationDTO,
  PointsOperationResult,
} from "#models/v1/economySystem/pointsSystem.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
 
export const body = PointsOperationDTO;

export const response = {
  200: PointsOperationResult,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Give points to user";
export const docs_description =
  "Adds points to the user's wallet and records the transaction.";
