 
import { IEventRepository } from "../domain/IEventRepository";
import { Event } from "../domain/Event";  
import { Tables, TablesInsert, TablesUpdate } from "@/v1/types/supabase.types";
import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";

type EventRow = Tables<"event">;
type EventInsertDTO = TablesInsert<"event">;
type EventUpdateDTO = TablesUpdate<"event">; // Keeping this for future use if needed

export class EventRepository implements IEventRepository {
  private readonly tableName = "event";

  /**
   * Helper: Maps a Supabase database row to a Domain Event Entity
   */
  private mapToDomain(row: EventRow): Event {
    return Event.hydrate({
      id: row.id,
      title: row.title,
      description: row.description || "",
      category: row.category || "",
      venue: row.venue || "",
      start_date: new Date(row.start_date || ""),
      end_date: new Date(row.end_date || ""),
      attendance_points: row.attendance_points,
      attendees_count: row.attendees_count,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  /**
   * Helper: Maps a Domain Event Entity to a Supabase DTO
   */
  private mapToDTO(event: Event): EventInsertDTO {
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
    };
  }

  async saveNewEvent(event: Event): Promise<Event> {
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
      .single();

    if (error) handlePostgresError(error);
    if (!data) throw new Error("Event not found");

    return this.mapToDomain(data);
  }

  async listEvents(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Event[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .order("start_date", { ascending: true })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }
}