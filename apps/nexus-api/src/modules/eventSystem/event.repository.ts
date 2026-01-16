import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts/models";

export class EventRepository {
  constructor() {}

  listEvents = async () => {
    const { data, error } = await supabase.from("event").select("*");
    if (error) {
      return { error };
    }

    const {count, error: countError } = await supabase
      .from("event")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return { error: countError };
    }


    
    return { data : {
      listData: data as Models.eventSystem.event.row[], 
      count: (count || 0) as number
    } };
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
    return { data : data as Models.eventSystem.event.row };
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
    return { data : data as Models.eventSystem.event.row };
  };
}

export const eventRepositoryInstance = new EventRepository();
