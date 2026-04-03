import { taskRow, taskUpdateDTO } from "#models/v1/tasksSystem/task.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(taskUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(taskRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update task";
export const docs_description = [
  "Purpose: Partially update an existing task.",
  "Inputs: Path param: taskId. Body: any combination of name, description, points_on_completion.",
  "Outputs: Updated task record.",
  "Errors: 400, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  data: {
    name: "Updated task name",
    points_on_completion: 150,
  },
};

export const docs_example_response = {
  status: "success",
  message: "Task updated successfully",
  data: {
    id: "task-1",
    user_id: "user-1",
    name: "Updated task name",
    description: "Fill in your bio and upload a profile picture",
    points_on_completion: 150,
    is_completed: false,
    completed_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-03-12T10:00:00.000Z",
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
  message: "Task not found.",
  errors: [{ title: "Not Found", detail: "No task found for the provided identifier." }],
};
export const docs_example_response_500 = {
  status: "error",
  message: "Internal server error.",
  errors: [{ title: "Internal Server Error", detail: "An unexpected error occurred." }],
};
