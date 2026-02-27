 import { supabase } from "@/v1/lib/supabase";
import { IStudyJamRepository, StudyJamFilters } from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";

export class SupabaseStudyJamRepository implements IStudyJamRepository {
  private readonly tableName = "study_jam";

  private mapToDomain(row: any): StudyJam {
    return StudyJam.hydrate({
      id: row.id,
      creatorId: row.creator_id,
      title: row.title || "",
      summary: row.summary || "",
      description: row.description || "",
      createdAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<StudyJam | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(pageNumber: number, pageSize: number, filters: StudyJamFilters = {}): Promise<{ list: StudyJam[]; count: number }> {
    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.search) {
      const term = filters.search.trim();
      query = query.or(`title.ilike.%${term}%,summary.ilike.%${term}%,description.ilike.%${term}%`);
    }
    if (filters.createdFrom) query = query.gte("created_at", filters.createdFrom);
    if (filters.createdTo) query = query.lte("created_at", filters.createdTo);

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, from + pageSize - 1);
    
    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map(row => this.mapToDomain(row)), 
      count: count || 0,
    };
  }

  async saveNew(studyJam: StudyJam): Promise<StudyJam> {
    const props = studyJam.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      creator_id: props.creatorId,
      title: props.title,
      summary: props.summary,
      description: props.description,
      created_at: props.createdAt.toISOString(),
    }).select().single();

    if (error) throw new Error(`Failed to create Study Jam: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(studyJam: StudyJam): Promise<StudyJam> {
    const props = studyJam.props;
    const { data, error } = await supabase.from(this.tableName).update({
      title: props.title,
      summary: props.summary,
      description: props.description,
    }).eq("id", props.id).select().single();

    if (error) throw new Error(`Failed to update Study Jam: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete Study Jam: ${error.message}`);
  }
}