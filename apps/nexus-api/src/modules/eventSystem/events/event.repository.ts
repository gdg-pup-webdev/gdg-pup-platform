import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

/**
 * Repository for accessing and managing event data in the database.
 * Handles direct interactions with the 'event' table.
 */
export class EventRepository {
  tableName = "event";

  constructor() {}

  /**
   * Lists events with optional filtering and pagination.
   *
   * @returns A promise resolving to a list of events and the total count.
   * @throws {DatabaseError} If a database error occurs.
   */
  listEvents = async (
    pageNumber: number,
    pageSize: number,
    filters: {
      creator_id?: string;
      category?: string;
      venue?: string;
      start_date_gte?: string;
      start_date_lte?: string;
      end_date_gte?: string;
      end_date_lte?: string;
    },
    options?: {
      orderBy?: { column: string; ascending?: boolean };
    },
  ): RepositoryResultList<models.eventSystem.event.row> => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.creator_id) {
      query = query.eq("creator_id", filters.creator_id);
    }
    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.venue) {
      query = query.eq("venue", filters.venue);
    }
    if (filters.start_date_gte) {
      query = query.gte("start_date", filters.start_date_gte);
    }
    if (filters.start_date_lte) {
      query = query.lte("start_date", filters.start_date_lte);
    }
    if (filters.end_date_gte) {
      query = query.gte("end_date", filters.end_date_gte);
    }
    if (filters.end_date_lte) {
      query = query.lte("end_date", filters.end_date_lte);
    }

    const orderBy = options?.orderBy ?? {
      column: "start_date",
      ascending: true,
    };
    const { data, count, error } = await query
      .order(orderBy.column, { ascending: orderBy.ascending })
      .range(from, to);

    if (error) throw new DatabaseError(error.message);

    return {
      list: data || [],
      count: count || 0,
    };
  };

  /**
   * Creates a new event record.
   *
   * @returns A promise resolving to the created event data.
   * @throws {DatabaseError} If a database error occurs.
   */
  createEvent = async (
    dto: models.eventSystem.event.insertDTO,
  ): RepositoryResult<models.eventSystem.event.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Retrieves a single event by its ID.
   *
   * @returns A promise resolving to the event data.
   * @throws {DatabaseError} If a database error occurs.
   */
  getEventById = async (
    id: string,
  ): RepositoryResult<models.eventSystem.event.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Deletes an event by its ID.
   *
   * @returns A promise resolving to the deleted event data.
   * @throws {DatabaseError} If a database error occurs.
   */
  deleteEvent = async (
    id: string,
  ): RepositoryResult<models.eventSystem.event.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Updates an existing event.
   *
   * @returns A promise resolving to the updated event data.
   * @throws {DatabaseError} If a database error occurs.
   */
  updateEvent = async (
    id: string,
    dto: models.eventSystem.event.updateDTO,
  ): RepositoryResult<models.eventSystem.event.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const eventRepositoryInstance = new EventRepository();
