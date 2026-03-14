import { taskRow, taskInsertDTO } from "#models/v1/tasksSystem/task.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(taskInsertDTO);

export const response = {
  201: OpenApiSchemas.Response.single(taskRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create task";
export const docs_description = [
  "Purpose: Create a new task and assign it to a user.",
  "Inputs: Body with user_id, name, description, points_on_completion.",
  "Outputs: Single task record.",
  "Errors: 400, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  data: {
    user_id: "user-1",
    name: "Complete your profile",
    description: "Fill in your bio and upload a profile picture",
    points_on_completion: 100,
  },
};

export const docs_example_response = {
  status: "success",
  message: "Task created successfully",
  data: {
    id: "task-1",
    user_id: "user-1",
    name: "Complete your profile",
    description: "Fill in your bio and upload a profile picture",
    points_on_completion: 100,
    is_completed: false,
    completed_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
};

export const docs_example_response_400 = {
  status: "error",
  message: "Invalid request.",
  errors: [{ title: "Bad Request", detail: "One or more request fields are invalid." }],
};
export const docs_example_response_401 = {
  status: "error",
  message: "Unauthorized.",
  errors: [{ title: "Unauthorized", detail: "Missing or invalid authentication token." }],
};
export const docs_example_response_403 = {
  status: "error",
  message: "Forbidden.",
  errors: [{ title: "Forbidden", detail: "You do not have permission to access this resource." }],
};
export const docs_example_response_404 = {
  status: "error",
  message: "User not found.",
  errors: [{ title: "Not Found", detail: "No user found for the provided user_id." }],
};
export const docs_example_response_500 = {
  status: "error",
  message: "Internal server error.",
  errors: [{ title: "Internal Server Error", detail: "An unexpected error occurred." }],
};
