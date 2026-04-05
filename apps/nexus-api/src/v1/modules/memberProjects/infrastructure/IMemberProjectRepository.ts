import { supabase } from "@/v1/lib/supabase";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { MemberProject, MemberProjectProps } from "../domain/MemberProject";
import { Tables } from "@/v1/types/supabase.types";

export class MemberProjectRepository implements IMemberProjectRepository {
  constructor() {}

  private toDb(project: MemberProject) {
    const { member, ...props } = project.props;
    return {
      ...props,
      createdAt: props.createdAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
      startDate: props.startDate.toISOString(),
      endDate: props.endDate ? props.endDate.toISOString() : null,
    };
  }

  private toProps(data: Tables<"member_projects"> & { member: Tables<"gdg_members"> | null }) : MemberProjectProps {
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
      
      member: data.member ? {
        gdgId: data.member.gdg_id,
        name: data.member.display_name,
        thumbnailImageUrl: data.member.avatar_image_url,
        email: data.member.email,
      } : null,
    };
  }

  async saveNew(project: MemberProject) {
    const { data, error } = await supabase
      .from("member_projects")
      .insert(this.toDb(project))
      .select("*, member:gdg_members(*) ")
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
      .select("*, member:gdg_members(*) ")
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
      .select("*, member:gdg_members(*) ")
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
      .select("*, member:gdg_members(*) ", { count: "exact" })
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
      .select("*, member:gdg_members(*) ", { count: "exact" })
      .eq("memberGdgId", memberGdgId)
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map((row) => MemberProject.hydrate(this.toProps(row))),
      count: count || 0,
    };
  }

  async search(
    queryText: string,
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const { data, count, error } = await supabase
      .from("member_projects")
      .select("*, member:gdg_members(*) ", { count: "exact" })
      .or(`title.ilike.%${queryText}%,description.ilike.%${queryText}%`)
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map((row) => MemberProject.hydrate(this.toProps(row))),
      count: count || 0,
    };
  }

  async findRandom(
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    // Note: Supabase doesn't have a native 'order by random' in the client.
    // For a simple implementation, we'll just fetch normally but we could use an RPC if needed.
    // Given the constraints, let's just do a normal fetch for now or use a different seed.
    const { data, count, error } = await supabase
      .from("member_projects")
      .select("*, member:gdg_members(*) ", { count: "exact" })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw new Error(`Database error: ${error.message}`);

    // Shuffle client side for 'random' effect if list is small, 
    // but pagination makes this tricky.
    const shuffled = (data || []).sort(() => Math.random() - 0.5);

    return {
      list: shuffled.map((row) => MemberProject.hydrate(this.toProps(row))),
      count: count || 0,
    };
  }
}
