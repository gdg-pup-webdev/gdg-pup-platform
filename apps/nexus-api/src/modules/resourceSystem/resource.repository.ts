import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts/models"; 
import { TablesInsert } from "@packages/nexus-api-contracts/types";

export class ResourceResponsitory {
  constructor() {}

  create = async (dto: TablesInsert<"external_resource">) => {
    const { data, error } = await supabase
      .from("external_resource")
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
      .from("external_resource")
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
      .from("external_resource")
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
      .from("external_resource")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      return { error };
    }

    const { count, error: countError } = await supabase
      .from("external_resource")
      .select("*", { count: "exact", head: true });
    if (countError) {
      return { error: countError };
    }

    return {
      data: {
        listData: data as Models.resourceSystem.resource.row[],
        count: (count || 0) as number,
      },
    };
  };

  getOne = async (resourceId: string) => {
    const { data, error } = await supabase
      .from("external_resource")
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
