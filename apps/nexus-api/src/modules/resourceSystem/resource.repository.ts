import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class ResourceResponsitory {
  constructor() {}

  create = async (dto: Models.resourceSystem.resource.insertDTO) => {
    const { data, error } = await supabase
      .from("resource")
      .insert(dto)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.resourceSystem.resource.row };
  };

  delete = async (resourceId: string) => {
    const { data, error } = await supabase
      .from("resource")
      .delete()
      .eq("id", resourceId)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.resourceSystem.resource.row };
  };

  update = async (
    resourceId: string,
    dto: Models.resourceSystem.resource.updateDTO
  ) => {
    const { data, error } = await supabase
      .from("resource")
      .update(dto)
      .eq("id", resourceId)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.resourceSystem.resource.row };
  };

  list = async () => {
    const { data, error } = await supabase
      .from("resource")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      return { error };
    }
    return { data: data as Models.resourceSystem.resource.row[] };
  };

  getOne = async (resourceId: string) => {
    const { data, error } = await supabase
      .from("resource")
      .select("*")
      .eq("id", resourceId)
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.resourceSystem.resource.row };
  };
}


export const resourceReponsitoryInstance = new ResourceResponsitory();