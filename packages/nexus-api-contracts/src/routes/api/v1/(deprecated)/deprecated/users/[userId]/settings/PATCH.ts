import { userSettingsRow, userSettingsInsertDTO, userSettingsUpdateDTO } from "#models/v1/userResourceSystem/settings.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(userSettingsUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(userSettingsRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update user settings";
export const docs_description = [
  "Update user settings",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response_400 = {
  status: "error",
  message: "Invalid request.",
  errors: [
    {
      title: "Bad Request",
      detail: "One or more request fields are invalid.",
    },
  ],
};
export const docs_example_response_401 = {
  status: "error",
  message: "Unauthorized.",
  errors: [
    {
      title: "Unauthorized",
      detail: "Missing or invalid authentication token.",
    },
  ],
};
export const docs_example_response_403 = {
  status: "error",
  message: "Forbidden.",
  errors: [
    {
      title: "Forbidden",
      detail: "You do not have permission to access this resource.",
    },
  ],
};
export const docs_example_response_404 = {
  status: "error",
  message: "SettingsId not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No settingsid found for the provided identifier.",
    },
  ],
};
export const docs_example_response_500 = {
  status: "error",
  message: "Internal server error.",
  errors: [
    {
      title: "Internal Server Error",
      detail: "An unexpected error occurred.",
    },
  ],
};

export const docs_example_response = {
  status: "success",
  message: "Settings updated",
  data: {
    id: "settings-1",
    user_id: "user-1",
    color_theme: false,
  },
};
