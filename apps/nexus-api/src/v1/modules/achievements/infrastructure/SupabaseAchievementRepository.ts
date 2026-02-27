import { IAchievementRepository } from "../domain/IAchievementRepository";
import { Achievement, AchievementProps } from "../domain/Achievement"; 
import { Tables, TablesInsert, TablesUpdate } from "@/v1/presentation/types/supabase.types";
import { supabase } from "@/v1/lib/supabase";

type AchievementRow = Tables<"user_achievement">;

export class SupabaseAchievementRepository implements IAchievementRepository {
  private readonly tableName = "user_achievement";

  private mapToDomain(row: AchievementRow): Achievement {
    return Achievement.hydrate({
      id: row.id,
      userId: row.user_id,
      title: (row as any).title || "", 
      description: (row as any).description || "",
      imageUrl: (row as any).image_url,
      // Provide a fallback of Date.now() if created_at is null
      earnedAt: new Date(row.created_at || Date.now()), 
    });
  }

  async findById(id: string): Promise<Achievement | null> {
    const { data } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(filters: { userId?: string } = {}, page = 1, size = 10) {
    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.userId) {
      query = query.eq("user_id", filters.userId);
    }

    const from = (page - 1) * size;
    const { data, count } = await query.range(from, from + size - 1);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count || 0,
    };
  }

  async saveNew(achievement: Achievement): Promise<Achievement> {
    const props = achievement.props;
    // Map Domain to DB Insert Type
    const dbPayload: TablesInsert<"user_achievement"> = {
      id: props.id,
      user_id: props.userId,
      title: props.title,
      // description: props.description, // Uncomment if these exist in DB schema
      // image_url: props.imageUrl,
      created_at: props.earnedAt.toISOString(),
    };

    const { data, error } = await supabase.from(this.tableName).insert(dbPayload).select().single();
    if (error) throw new Error(`Failed to create achievement: ${error.message}`);
    
    return this.mapToDomain(data);
  }

  /**
   * Persists an already-mutated Domain Entity to the database.
   */
  async persistUpdates(achievement: Achievement): Promise<Achievement> {
    const props = achievement.props;
    
    // Map Domain to DB Update Type
    // We only map the fields that are allowed to change
    const dbPayload: TablesUpdate<"user_achievement"> = {
      title: props.title,
      // description: props.description, // Uncomment if these exist in DB schema
      // image_url: props.imageUrl,
    };

    const { data, error } = await supabase
      .from(this.tableName)
      .update(dbPayload)
      .eq("id", props.id) // Use the ID from the domain object to find the row
      .select()
      .single();

    if (error) throw new Error(`Failed to update achievement: ${error.message}`);

    return this.mapToDomain(data);
  }

  /**
   * Removes the record from the database.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete achievement: ${error.message}`);
  }
}