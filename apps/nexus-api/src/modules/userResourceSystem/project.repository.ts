import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class ProjectRepository {
  constructor() {}

  listProjectsOfUser = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_project")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      return { error };
    }
    return { data };
  };

  getOne = async (id: string) => {
    const { data, error } = await supabase
      .from("user_project")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };

  create = async (dto: Models.userResourceSystem.project.insertDTO) => {
    // parse schema
    const dtoParseRes =
      Models.userResourceSystem.project.insertDTO.safeParse(dto);
    if (!dtoParseRes.success) {
      return {
        error: new Error(`Invalid project data. ${dtoParseRes.error.message}`),
      };
    }
    const parsedDto = dtoParseRes.data;

    const { data, error } = await supabase
      .from("user_project")
      .insert(parsedDto)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };

  delete = async (id: string) => {
    const { data, error } = await supabase
      .from("user_project")
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };

  update = async (
    id: string,
    dto: Models.userResourceSystem.project.updateDTO
  ) => {
    const { data, error } = await supabase
      .from("user_project")
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

export const projectRepositoryInstance = new ProjectRepository();
