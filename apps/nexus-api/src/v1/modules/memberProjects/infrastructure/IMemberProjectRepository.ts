import { supabase } from "@/v1/lib/supabase";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { MemberProject } from "../domain/MemberProject";
import { Tables } from "@/v1/types/supabase.types";

export class MemberProjectRepository implements IMemberProjectRepository {
  constructor() {}

  private toDb(project: MemberProject) {
    return {
      ...project.props,
      createdAt: project.props.createdAt.toISOString(),
      updatedAt: project.props.updatedAt.toISOString(),
      startDate: project.props.startDate.toISOString(),
      endDate: project.props.endDate
        ? project.props.endDate.toISOString()
        : null,
    };
  }

  private toProps(data: Tables<"member_projects">) {
    return {
      ...data,
      title: data.title || "",
      description: data.description || "",
      mainImageUrl: data.mainImageUrl || "",
      secondaryImageUrl: data.secondaryImageUrl || "",
      tertiaryImageUrl: data.tertiaryImageUrl || "",
      memberGdgId: data.memberGdgId || "",
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt || ""),
      startDate: new Date(data.startDate || ""),
      endDate: data.endDate ? new Date(data.endDate) : null,
    };
  }

  async saveNew(project: MemberProject) {
    const { data, error } = await supabase
      .from("member_projects")
      .insert(this.toDb(project))
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return MemberProject.hydrate(this.toProps(data));
  }

  async persistUpdates(memberProject: MemberProject): Promise<MemberProject> {
    const { data, error } = await supabase
      .from("member_projects")
      .update(this.toDb(memberProject))
      .eq("id", memberProject.props.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return MemberProject.hydrate(this.toProps(data));
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("member_projects")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async findById(id: string): Promise<MemberProject | null> {
    const { data, error } = await supabase
      .from("member_projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? MemberProject.hydrate(this.toProps(data)) : null;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const { data, count, error } = await supabase
      .from("member_projects")
      .select("*", { count: "exact" })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map((row) => MemberProject.hydrate(this.toProps(row))),
      count: count || 0,
    };
  }

  async findByMemberGdgId(
    memberGdgId: string,
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const { data, count, error } = await supabase
      .from("member_projects")
      .select("*", { count: "exact" })
      .eq("memberGdgId", memberGdgId)
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map((row) => MemberProject.hydrate(this.toProps(row))),
      count: count || 0,
    };
  }
}
