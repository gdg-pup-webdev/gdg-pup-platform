import {
  PointsOperationDTO,
  PointsOperationResult,
} from "#models/v1/economySystem/pointsSystem.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = OpenApiSchemas.Request.Params.id("userId");

export const body = PointsOperationDTO;

export const response = {
  200: PointsOperationResult,
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Consume points from a user";
export const docs_description =
  "Debits the provided point entries from the user's wallet and records a transaction.";
