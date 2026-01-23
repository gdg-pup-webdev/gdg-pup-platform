import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

export class EventRepository {
  tableName = "event";

  constructor() {}

  listEvents = async (): RepositoryResultList<models.eventSystem.event.row> => {
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
