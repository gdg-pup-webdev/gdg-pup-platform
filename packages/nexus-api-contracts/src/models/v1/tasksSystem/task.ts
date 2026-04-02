import { cz } from "@packages/typed-rest/shared";

/** Represents a full task record. */
export const taskRow = cz.object({
  id: cz.string(),
  user_id: cz.string(),
  name: cz.string(),
  description: cz.string(),
  points_on_completion: cz.number(),
  is_completed: cz.boolean(),
  completed_at: cz.string().nullable(),
  created_at: cz.string(),
  updated_at: cz.string(),
});

/** Data Transfer Object for creating a new task. */
export const taskInsertDTO = cz.object({
  user_id: cz.string(),
  name: cz.string(),
  description: cz.string(),
  points_on_completion: cz.number().int().nonnegative(),
});

/** Data Transfer Object for partially updating an existing task. */
export const taskUpdateDTO = cz.object({
  name: cz.string().optional(),
  description: cz.string().optional(),
  points_on_completion: cz.number().int().nonnegative().optional(),
});

/** Response shape returned after completing a task (includes new points balance). */
export const taskCompleteResponse = cz.object({
  task: taskRow,
  new_total_points: cz.number(),
});
