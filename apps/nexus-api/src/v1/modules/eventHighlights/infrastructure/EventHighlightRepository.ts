import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";
import { EventHighlight } from "../domain/EventHighlight";
import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/utils/handlePostgresError";
import { Tables, TablesInsert, TablesUpdate } from "@/v1/types/supabase.types";

export class EventHighlightRepository implements IEventHighlightRepository {
  private mapToDomain(row: Tables<"event_highlight">): EventHighlight {
    return EventHighlight.hydrate({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      imageUrl: row.image_url || undefined,
      authorId: row.author_id,
      eventId: row.event_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  private mapToRow(highlight: EventHighlight): TablesInsert<"event_highlight"> {
    return {
      id: highlight.props.id,
      title: highlight.props.title,
      description: highlight.props.description,
      content: highlight.props.content,
      image_url: highlight.props.imageUrl || null,
      author_id: highlight.props.authorId,
      event_id: highlight.props.eventId,
      created_at: highlight.props.createdAt.toISOString(),
      updated_at: highlight.props.updatedAt.toISOString(),
    };
  }

  async saveNew(highlight: EventHighlight): Promise<EventHighlight> {
    const { data, error } = await supabase
      .from("event_highlight")
      .insert(this.mapToRow(highlight))
      .select()
      .single();

    if (error) handlePostgresError(error);
    return this.mapToDomain(data);
  }

  async persistUpdates(highlight: EventHighlight): Promise<EventHighlight> {
    const { data, error } = await supabase
      .from("event_highlight")
      .update({
        title: highlight.props.title,
        description: highlight.props.description,
        content: highlight.props.content,
        image_url: highlight.props.imageUrl || null,
        author_id: highlight.props.authorId,
        event_id: highlight.props.eventId,
        updated_at: highlight.props.updatedAt.toISOString(),
      })
      .eq("id", highlight.props.id)
      .select()
      .single();

    if (error) handlePostgresError(error);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("event_highlight").delete().eq("id", id);
    if (error) handlePostgresError(error);
  }

  async findById(id: string): Promise<EventHighlight | undefined> {
    const { data, error } = await supabase
      .from("event_highlight")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (error) handlePostgresError(error);
    return data ? this.mapToDomain(data) : undefined;
  }

  async list(
    pageNumber: number,
    pageSize: number,
    eventId?: string,
  ): Promise<{ list: EventHighlight[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("event_highlight")
      .select("*", { count: "exact" });

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count || 0,
    };
  }
}
