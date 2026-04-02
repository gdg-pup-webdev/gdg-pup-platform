import { supabase } from "@/v1/lib/supabase";
import { IBevyEventRepository } from "../domain/IBevyEventRepository";
import { BevyEvent } from "../domain/BevyEvent";
import { Tables } from "@/v1/types/supabase.types";

type ScrapedGdgEventRow = Tables<"scraped_gdg_events">;

export class SupabaseBevyEventRepository implements IBevyEventRepository {
  private readonly tableName = "scraped_gdg_events";

  private mapToDomain(row: ScrapedGdgEventRow): BevyEvent {
    // We hydrate the domain entity, mapping database columns to the BevyEventProps.
    // Since your BevyEventProps already uses snake_case, the mapping is very straightforward.
    return BevyEvent.hydrate({
      id: row.gdg_id.toString(),
      title: row.title,
      short_description: row.description_short ?? undefined,
      bevy_url: row.url ?? undefined,
      start_date: row.start_date,
      end_date: row.end_date,
      location: row.location ?? undefined,
      cover_image_url: row.cover_image_url ?? undefined,
      image_square_url: row.image_square_url ?? undefined,
      status: row.status ?? undefined,
      event_type: row.event_type ?? undefined,
      created_at: row.created_at ?? undefined,
      updated_at: row.updated_at ?? undefined,
      description: row.description ?? undefined,
      tags: (row.tags as string[]) ?? undefined,
      attendees: row.total_attendees ?? undefined,
      total_capacity: row.total_capacity ?? undefined,
      attendee_virtual_venue_url: row.attendee_virtual_venue_link ?? undefined,
      event_type_slug: row.event_type_slug ?? undefined,
      video_url: row.video_url ?? undefined,
      is_virtual_event: row.is_virtual_event ?? undefined,
    });
  }

  async findAll(pageNumber: number, pageSize: number): Promise<{ list: BevyEvent[]; count: number }> {
    const query = supabase.from(this.tableName).select("*", { count: "exact" });

    // Calculate the pagination range for Supabase (0-indexed inclusive)
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // Fetch paginated data, ordering by start_date so the newest/upcoming events are first
    const { data, count, error } = await query
      .order("start_date", { ascending: false }) 
      .range(from, to);

    if (error) {
      throw new Error(`Database error fetching Bevy events: ${error.message}`);
    }

    return {
      // Map the raw DB rows back into our clean Domain Objects
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count || 0,
    };
  }

  async findById(id: string): Promise<BevyEvent | undefined> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("gdg_id", parseInt(id))
      .maybeSingle();

    if (error) {
      throw new Error(`Database error fetching Bevy event ${id}: ${error.message}`);
    }

    return data ? this.mapToDomain(data) : undefined;
  }
}