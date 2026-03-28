import { IEventRepository, EventFilters } from "../domain/IEventRepository";
import { Event } from "../domain/Event";
import { Tables, TablesInsert, TablesUpdate } from "@/v1/types/supabase.types";
import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";

type EventRow = Tables<"event">;
type EventInsertDTO = TablesInsert<"event">;
type EventUpdateDTO = TablesUpdate<"event">;

export class EventRepository implements IEventRepository {
  private readonly tableName = "event";

  private mapToDomain(row: any): Event {
    return Event.hydrate({
      id: row.id,
      title: row.title,
      description: row.description || "",
      category: row.category || "",
      venue: row.venue || "",
      start_date: new Date(row.start_date || ""),
      end_date: new Date(row.end_date || ""),
      attendance_points: Number(row.attendance_points),
      attendees_count: Number(row.attendees_count),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      bevy_event_id: row.gdg_event_id?.toString() ?? null,
      creatorId: row.creator_id || "",
      image_url: row.thumbnail_url || null,
      bevyPreviewUrl: row.bevy_preview_url || null,
      tags: row.tags ? row.tags.split(",") : [],
      max_capacity: row.max_capacity ? parseInt(row.max_capacity) : 999999,
      short_description: row.short_description || null,
      // New props
      speakers: row.speakers || [],
      type: row.type || null,
      teamId: row.team_id || null,
    });
  }

  private mapToDTO(event: Event): any {
    const props = event.props;
    return {
      id: props.id,
      title: props.title,
      description: props.description,
      category: props.category,
      venue: props.venue,
      start_date: props.start_date.toISOString(),
      end_date: props.end_date.toISOString(),
      attendance_points: props.attendance_points,
      attendees_count: props.attendees_count,
      created_at: props.createdAt.toISOString(),
      updated_at: props.updatedAt.toISOString(),
      gdg_event_id: props.bevy_event_id ? parseInt(props.bevy_event_id) : null,
      thumbnail_url: props.image_url || null,
      bevy_preview_url: props.bevyPreviewUrl || null,
      max_capacity: props.max_capacity.toString(),
      short_description: props.short_description,
      tags: props.tags.join(","),
      creator_id: props.creatorId || null,
      // New props
      speakers: props.speakers,
      type: props.type,
      team_id: props.teamId,
    };
  }

  async listEvents(
    pageNumber: number,
    pageSize: number,
    filters?: EventFilters
  ): Promise<{ list: Event[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(this.tableName)
      .select("*", { count: "exact" });

    if (filters) {
      if (filters.type) query = query.eq("type", filters.type);
      if (filters.teamId) query = query.eq("team_id", filters.teamId);
      if (filters.category) query = query.eq("category", filters.category);
    }

    const { data, count, error } = await query
      .order("start_date", { ascending: true })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }

  async findByType(type: string, pageNumber: number, pageSize: number): Promise<{ list: Event[]; count: number }> {
    return this.listEvents(pageNumber, pageSize, { type });
  }

  async findByTeamId(teamId: string, pageNumber: number, pageSize: number): Promise<{ list: Event[]; count: number }> {
    return this.listEvents(pageNumber, pageSize, { teamId });
  }

  async listEventsByYear(
    pageNumber: number,
    pageSize: number,
    year: number,
  ): Promise<{ list: Event[]; count: number }> { 
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .gte("start_date", new Date(year, 0, 1).toISOString())
      .lte("start_date", new Date(year, 11, 31).toISOString())
      .order("start_date", { ascending: true })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }

  async saveNew(event: Event): Promise<Event> {
    const dto = this.mapToDTO(event);
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) handlePostgresError(error);
    return this.mapToDomain(data);
  }

  async persistUpdates(event: Event): Promise<Event> {
    const dto = this.mapToDTO(event);
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", event.props.id)
      .select("*")
      .single();

    if (error) handlePostgresError(error);
    return this.mapToDomain(data);
  }

  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", eventId);

    if (error) handlePostgresError(error);
  }

  async findById(eventId: string): Promise<Event> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", eventId)
      .maybeSingle();

    if (error) handlePostgresError(error);
    if (!data) throw new Error(`Event with ID ${eventId} not found`);

    return this.mapToDomain(data);
  }

  async findByBevyId(bevyEventId: string): Promise<Event | undefined> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("gdg_event_id", parseInt(bevyEventId))
      .maybeSingle();

    if (error) handlePostgresError(error);
    return data ? this.mapToDomain(data) : undefined;
  }
}
