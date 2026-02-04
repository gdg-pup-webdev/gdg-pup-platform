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

  listEvents =
    async (): RespositoryResultList<models.eventSystem.event.row> => {
      const { data, error } = await supabase.from(this.tableName).select("*");
      if (error) throw new DatabaseError(error.message);

      const { count, error: countError } = await supabase
        .from(this.tableName)
        .select("*", { count: "exact", head: true });
      if (countError) throw new DatabaseError(countError.message);

      return {
        list: data,
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
