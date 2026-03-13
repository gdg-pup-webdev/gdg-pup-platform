import { taskCompleteResponse } from "#models/v1/tasksSystem/task.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(taskCompleteResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Complete task";
export const docs_description = [
  "Purpose: Mark a task as completed and award its points to the assigned user.",
  "Inputs: Path param: taskId. No request body required.",
  "Outputs: Updated task record and the user's new total points balance.",
  "Errors: 400, 403, 404, 409 (already completed), 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  status: "success",
  message: "Task completed successfully",
  data: {
    task: {
      id: "task-1",
      user_id: "user-1",
      name: "Complete your profile",
      description: "Fill in your bio and upload a profile picture",
      points_on_completion: 100,
      is_completed: true,
      completed_at: "2026-03-12T10:00:00.000Z",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-03-12T10:00:00.000Z",
    },
    new_total_points: 350,
  },
};

export const docs_example_response_400 = {
  status: "error",
  message: "Task is already completed.",
  errors: [{ title: "Bad Request", detail: "This task has already been marked as completed." }],
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
