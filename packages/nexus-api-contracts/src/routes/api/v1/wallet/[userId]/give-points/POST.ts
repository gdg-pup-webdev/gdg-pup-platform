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

export const docs_summary = "Give points to a user";
export const docs_description =
  "Credits the provided point entries to the user's wallet and records a transaction.";
