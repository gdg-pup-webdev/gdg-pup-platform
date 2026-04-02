import { Tables } from "@/v1/types/supabase.types";
import { ITaskRepository } from "../domain/ITaskRepository";
import { Task, TaskProps } from "../domain/Task";
import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";

type TaskRow = Tables<"task">;

type TaskInsertDTO = Omit<TaskRow, never>;

export class SupabaseTaskRepository implements ITaskRepository {
  private readonly tableName = "task";

  private mapToDomain(row: TaskRow): Task {
    return Task.hydrate({
      id: row.id,
      userId: row.user_id,
      name: row.name || "",
      description: row.description || "",
      pointsOnCompletion: row.points_on_completion || 0,
      isCompleted: row.is_completed || false,
      completedAt: row.completed_at ? new Date(row.completed_at) : null,
      createdAt: new Date(row.created_at || Date.now()),
      updatedAt: new Date(row.updated_at || Date.now()),
    });
  }

  private mapToDTO(task: Task): TaskInsertDTO {
    const p = task.props;
    return {
      id: p.id,
      user_id: p.userId,
      name: p.name,
      description: p.description,
      points_on_completion: p.pointsOnCompletion,
      is_completed: p.isCompleted,
      completed_at: p.completedAt ? p.completedAt.toISOString() : null,
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
    };
  }

  async saveNew(task: Task): Promise<Task> {
    const dto = this.mapToDTO(task);

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) handlePostgresError(error);

    return this.mapToDomain(data);
  }

  async persistUpdates(task: Task): Promise<Task> {
    const dto = this.mapToDTO(task);

    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", task.props.id)
      .select("*")
      .single();

    if (error) handlePostgresError(error);

    return this.mapToDomain(data);
  }

  async findById(taskId: string): Promise<Task> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) handlePostgresError(error);
    if (!data) throw new Error("Task not found");

    return this.mapToDomain(data);
  }

  async findByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Task[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }
}
