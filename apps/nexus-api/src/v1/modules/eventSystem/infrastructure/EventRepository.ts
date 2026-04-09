import { IEventRepository, EventFilters } from "../domain/IEventRepository";
import { Event } from "../domain/Event";
import { Tables, TablesInsert, TablesUpdate } from "@/v1/types/supabase.types";
import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";

type EventRow = Tables<"event">;
type EventInsertDTO = TablesInsert<"event">;
type EventUpdateDTO = TablesUpdate<"event">;
type TeamRelation = { name?: string | null } | null;
type EventRowWithTeam = EventRow & {
  team?: TeamRelation | TeamRelation[];
};

export class EventRepository implements IEventRepository {
  private readonly tableName = "event";
  private readonly selectWithTeam = "*, team(name)";

  private extractTeamName(row: EventRowWithTeam): string | null {
    const team = row?.team;

    if (!team) return null;

    if (Array.isArray(team)) {
      const first = team[0];
      return typeof first?.name === "string" ? first.name : null;
    }

    return typeof team.name === "string" ? team.name : null;
  }

  private mapToDomain(row: EventRowWithTeam): Event {
    /**
     * Helper to clean array fields from corrupted data.
     * Handles:
     * 1. Actual arrays returned by Supabase
     * 2. Corrupted nested string arrays like ["[\"a\"]"]
     * 3. Legacy comma-separated strings
     * 4. Artifact strings like "[]" or ""
     */
    const cleanArray = (val: any): string[] => {
      if (!val) return [];

      let workingArray: any[] = [];

      if (Array.isArray(val)) {
        workingArray = val;
      } else if (typeof val === "string") {
        if (val === "[]" || val === "") return [];
        // Try parsing as JSON first (handles '["a", "b"]')
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) workingArray = parsed;
          else workingArray = [val];
        } catch (e) {
          // Fallback to comma separated
          workingArray = val.split(",");
        }
      }

      // Final pass: filter out empty/nulls and RECURSIVELY check for stringified arrays
      // which is what caused the ["[\"a\"]"] issue
      return workingArray
        .map((item) => {
          if (typeof item !== "string") return String(item);
          const trimmed = item.trim();
          // If the string itself looks like an array, try to parse it (handles the corruption case)
          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
              const nested = JSON.parse(trimmed);
              if (Array.isArray(nested)) return nested;
            } catch (e) {}
          }
          return trimmed;
        })
        .flat() // Un-nest if any strings were parsed into arrays
        .filter((item) => item && item !== "[]" && item !== "");
    };

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
      tags: cleanArray(row.tags),
      max_capacity: row.max_capacity ? parseInt(row.max_capacity) : 999999,
      short_description: row.short_description || null,
      speakers: cleanArray(row.speakers),
      type: row.type || null,
      teamId: row.team_id || null,
      teamName: this.extractTeamName(row),
    });
  }

  private mapToDTO(event: Event): any {
    const props = event.props;

    let gdg_event_id: number | null = null;
    if (props.bevy_event_id) {
      const parsed = parseInt(props.bevy_event_id);
      if (!isNaN(parsed)) {
        gdg_event_id = parsed;
      }
    }

    // Pass arrays directly to Supabase client, don't stringify
    // Multer/API layer should have already ensured these are clean arrays
    const cleanTags = Array.isArray(props.tags)
      ? props.tags.filter((t) => t && t !== "[]")
      : [];
    const cleanSpeakers = Array.isArray(props.speakers)
      ? props.speakers.filter((s) => s && s !== "[]")
      : [];

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
      gdg_event_id,
      thumbnail_url: props.image_url || null,
      bevy_preview_url: props.bevyPreviewUrl || null,
      max_capacity: props.max_capacity.toString(),
      short_description: props.short_description,
      tags: cleanTags,
      creator_id: props.creatorId || null,
      speakers: cleanSpeakers,
      type: props.type,
      team_id: props.teamId,
    };
  }

  async listEvents(
    pageNumber: number,
    pageSize: number,
    filters?: EventFilters,
  ): Promise<{ list: Event[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const selectStr = filters?.teamName
      ? "*, team!inner(name)"
      : this.selectWithTeam;

    let query = supabase
      .from(this.tableName)
      .select(selectStr, { count: "exact" });

    if (filters) {
      if (filters.type) {
        query = query.ilike("type", `%${filters.type}%`);
      }
      if (filters.teamId) {
        query = query.eq("team_id", filters.teamId);
      }
      if (filters.teamName) {
        query = query.ilike("team.name", `%${filters.teamName}%`);
      }
      if (filters.category) {
        query = query.ilike("category", `%${filters.category}%`);
      }
      if (filters.year) {
        query = query
          .gte("start_date", new Date(filters.year, 0, 1).toISOString())
          .lte(
            "start_date",
            new Date(filters.year, 11, 31, 23, 59, 59).toISOString(),
          );
      }
    }

    const { data, count, error } = await query
      .order("start_date", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }

  async findByType(
    type: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Event[]; count: number }> {
    return this.listEvents(pageNumber, pageSize, { type });
  }

  async findByTeamId(
    teamId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Event[]; count: number }> {
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
      .select(this.selectWithTeam, { count: "exact" })
      .gte("start_date", new Date(year, 0, 1).toISOString())
      .lt("start_date", new Date(year + 1, 0, 1).toISOString())
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
      .select(this.selectWithTeam)
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
      .select(this.selectWithTeam)
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
      .select(this.selectWithTeam)
      .eq("id", eventId)
      .maybeSingle();

    if (error) handlePostgresError(error);
    if (!data) throw new Error(`Event with ID ${eventId} not found`);

    return this.mapToDomain(data);
  }

  async findByBevyId(bevyEventId: string): Promise<Event | undefined> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.selectWithTeam)
      .eq("gdg_event_id", parseInt(bevyEventId))
      .maybeSingle();

    if (error) handlePostgresError(error);
    return data ? this.mapToDomain(data) : undefined;
  }
}
