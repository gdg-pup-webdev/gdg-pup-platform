import { supabase } from "@/v1/lib/supabase";
import { IBevyEventRepository } from "../domain/IBevyEventRepository";
import { BevyEvent } from "../domain/BevyEvent";

export class SupabaseBevyEventRepository implements IBevyEventRepository {
  private readonly tableName = "scraped_gdg_events";

  private mapToDomain(row: any): BevyEvent {
    // We hydrate the domain entity, mapping database columns to the BevyEventProps.
    // Since your BevyEventProps already uses snake_case, the mapping is very straightforward.
    return BevyEvent.hydrate({
      id: row.id,
      title: row.title,
      short_description: row.short_description,
      bevy_url: row.bevy_url,
      start_date: row.start_date,
      end_date: row.end_date,
      location: row.location,
      cover_image_url: row.cover_image_url,
      status: row.status,
      event_type: row.event_type,
      created_at: row.created_at,
      updated_at: row.updated_at,
      description: row.description,
      tags: row.tags,
      attendees: row.attendees,
      total_capacity: row.total_capacity,
      attendee_virtual_venue_url: row.attendee_virtual_venue_url,
      event_type_slug: row.event_type_slug,
      video_url: row.video_url,
      is_virtual_event: row.is_virtual_event,
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
}