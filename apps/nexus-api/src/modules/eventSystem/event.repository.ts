import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class EventRepository {
  constructor() {}

  listEvents = async () => {
    const { data, error } = await supabase.from("event").select("*");
    if (error) {
      return { error };
    }
    return { data };
  };

  createEvent = async (dto: Models.eventSystem.event.insertDTO) => {
    const { data, error } = await supabase
      .from("event")
      .insert(dto)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };

  getEventById = async (id: string) => {
    const { data, error } = await supabase
      .from("event")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.eventSystem.event.row };
  };

  deleteEvent = async (id: string) => {
    const { data, error } = await supabase
      .from("event")
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };

  updateEvent = async (id: string, dto: Models.eventSystem.event.updateDTO) => {
    const { data, error } = await supabase
      .from("event")
      .update(dto)
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const eventRepositoryInstance = new EventRepository();
