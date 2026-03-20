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

export const docs_summary = "Consume user points";
export const docs_description =
  "Deducts points from the user's wallet and records the transaction.";
