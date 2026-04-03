import { userRow, userInsertDTO, userUpdateDTO, userAggregate } from "#models/v1/userSystem/user.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  sortBy: cz.string(),
  sortDirection: cz.string(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(userRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get paginated list of users";
export const docs_description = "Get paginated list of users";
