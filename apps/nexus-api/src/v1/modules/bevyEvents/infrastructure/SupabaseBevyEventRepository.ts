import { supabase } from "@/v1/lib/supabase";
import { IBevyEventRepository } from "../domain/IBevyEventRepository";
import { BevyEvent } from "../domain/BevyEvent";
import { Tables, TablesInsert } from "@/v1/types/supabase.types";

type ScrapedGdgEventRow = Tables<"scraped_gdg_events">;
type ScrapedGdgEventInsert = TablesInsert<"scraped_gdg_events">;

export class SupabaseBevyEventRepository implements IBevyEventRepository {
  private readonly tableName = "scraped_gdg_events";

  private mapToDomain(row: ScrapedGdgEventRow): BevyEvent {
    return BevyEvent.hydrate({
      id: row.gdg_id.toString(),
      title: row.title,
      short_description: row.description_short ?? undefined,
      bevy_url: row.url,
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
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
      .order("start_date", { ascending: false }) 
      .range(from, to);

    if (error) {
      throw new Error(`Database error fetching Bevy events: ${error.message}`);
    }

    return {
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

  async upsertMany(events: BevyEvent[]): Promise<void> {
    const rows: ScrapedGdgEventInsert[] = events.map(event => {
      const props = event.props;
      return {
        gdg_id: parseInt(props.id),
        title: props.title,
        description_short: props.short_description,
        description: props.description,
        url: props.bevy_url,
        start_date: props.start_date,
        end_date: props.end_date,
        location: props.location,
        cover_image_url: props.cover_image_url,
        image_square_url: props.image_square_url,
        status: props.status,
        event_type: props.event_type,
        event_type_slug: props.event_type_slug,
        tags: props.tags,
        total_attendees: props.attendees,
        total_capacity: props.total_capacity,
        attendee_virtual_venue_link: props.attendee_virtual_venue_url,
        video_url: props.video_url,
        is_virtual_event: props.is_virtual_event,
        last_scraped_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from(this.tableName)
      .upsert(rows, { onConflict: "gdg_id" });

    if (error) {
      throw new Error(`Database error upserting Bevy events: ${error.message}`);
    }
  }
}
