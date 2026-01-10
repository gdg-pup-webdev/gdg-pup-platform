import { supabase } from "@/lib/supabase.js";

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
}

export const projectRepositoryInstance = new ProjectRepository();
