import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { ValidationError } from "@/v1/errors/HttpError";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { MemberProject, MemberProjectProps } from "../domain/MemberProject";
import { Tables } from "@/v1/types/supabase.types";

type MemberProjectImageRow = {
  id: string;
  memberProjectId: string;
  imageUrl: string;
  position: number;
  createdAt: string;
  updatedAt: string | null;
};

type MemberProjectRowWithRelations = Tables<"member_projects"> & {
  member: Tables<"gdg_members"> | null;
  images: MemberProjectImageRow[] | null;
};

export class MemberProjectRepository implements IMemberProjectRepository {
  private readonly selectWithRelations =
    "*, member:gdg_members(*), images:member_project_images(*)";

  constructor() {}

  private toDb(project: MemberProject) {
    const { member, images, ...props } = project.props;

    return {
      ...props,
      createdAt: props.createdAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
      startDate: props.startDate.toISOString(),
      endDate: props.endDate ? props.endDate.toISOString() : null,
    };
  }

  private toImages(data: MemberProjectImageRow[] | null | undefined): string[] {
    return [...(data || [])]
      .sort((a, b) => a.position - b.position)
      .map((image) => image.imageUrl)
      .filter((imageUrl) => Boolean(imageUrl));
  }

  private async fetchImageRows(projectId: string): Promise<MemberProjectImageRow[]> {
    const { data, error } = await (supabase as any)
      .from("member_project_images")
      .select("*")
      .eq("memberProjectId", projectId)
      .order("position", { ascending: true });

    if (error) {
      handlePostgresError(error);
    }

    return (data || []) as MemberProjectImageRow[];
  }

  private async restoreImageRows(
    projectId: string,
    imageRows: MemberProjectImageRow[],
  ): Promise<void> {
    const { error: clearError } = await (supabase as any)
      .from("member_project_images")
      .delete()
      .eq("memberProjectId", projectId);

    if (clearError) {
      handlePostgresError(clearError);
    }

    if (imageRows.length === 0) {
      return;
    }

    const payload = imageRows.map((row) => ({
      memberProjectId: row.memberProjectId,
      imageUrl: row.imageUrl,
      position: row.position,
      updatedAt: new Date().toISOString(),
    }));

    const { error: restoreError } = await (supabase as any)
      .from("member_project_images")
      .insert(payload);

    if (restoreError) {
      handlePostgresError(restoreError);
    }
  }

  private toProps(data: MemberProjectRowWithRelations): MemberProjectProps {
    return {
      ...data,
      title: data.title || "",
      description: data.description || "",
      images: this.toImages(data.images),
      memberGdgId: data.memberGdgId || "",
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt || data.createdAt),
      startDate: new Date(data.startDate || data.createdAt),
      endDate: data.endDate ? new Date(data.endDate) : null,

      member: data.member
        ? {
            gdgId: data.member.gdg_id,
            name: data.member.display_name,
            thumbnailImageUrl: data.member.avatar_image_url,
            email: data.member.email,
          }
        : null,
    };
  }

  private async syncImageRows(
    projectId: string,
    imageUrls: string[],
  ): Promise<void> {
    const { error: deleteError } = await (supabase as any)
      .from("member_project_images")
      .delete()
      .eq("memberProjectId", projectId);

    if (deleteError) {
      handlePostgresError(deleteError);
    }

    if (imageUrls.length === 0) {
      return;
    }

    const payload = imageUrls.map((imageUrl, position) => ({
      memberProjectId: projectId,
      imageUrl,
      position,
      updatedAt: new Date().toISOString(),
    }));

    const { error: insertError } = await (supabase as any)
      .from("member_project_images")
      .insert(payload);

    if (insertError) {
      handlePostgresError(insertError);
    }
  }

  private async fetchById(id: string): Promise<MemberProject | null> {
    const { data, error } = await (supabase as any)
      .from("member_projects")
      .select(this.selectWithRelations)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      handlePostgresError(error);
    }

    if (!data) {
      return null;
    }

    return MemberProject.hydrate(
      this.toProps(data as MemberProjectRowWithRelations),
    );
  }

  async saveNew(project: MemberProject) {
    const memberGdgId = project.props.memberGdgId;
    const { data: latestProjectForMember, error: latestProjectError } = await (
      supabase as any
    )
      .from("member_projects")
      .select("position")
      .eq("memberGdgId", memberGdgId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestProjectError) {
      handlePostgresError(latestProjectError);
    }

    const nextPosition =
      typeof latestProjectForMember?.position === "number"
        ? latestProjectForMember.position + 1
        : 0;

    const { data, error } = await (supabase as any)
      .from("member_projects")
      .insert({
        ...this.toDb(project),
        position: nextPosition,
      })
      .select("id")
      .single();

    if (error) {
      handlePostgresError(error);
    }

    try {
      await this.syncImageRows(data.id, project.props.images);
    } catch (error) {
      // Best effort DB cleanup for partially created records.
      const { error: cleanupImagesError } = await (supabase as any)
        .from("member_project_images")
        .delete()
        .eq("memberProjectId", data.id);

      if (cleanupImagesError) {
        handlePostgresError(cleanupImagesError);
      }

      const { error: cleanupProjectError } = await (supabase as any)
        .from("member_projects")
        .delete()
        .eq("id", data.id);

      if (cleanupProjectError) {
        handlePostgresError(cleanupProjectError);
      }

      throw error;
    }

    const fetched = await this.fetchById(data.id);
    if (!fetched) {
      throw new Error(
        `Failed to load newly created member project ${data.id}.`,
      );
    }

    return fetched;
  }

  async persistUpdates(memberProject: MemberProject): Promise<MemberProject> {
    const previousImageRows = await this.fetchImageRows(memberProject.props.id);

    const { data, error } = await (supabase as any)
      .from("member_projects")
      .update(this.toDb(memberProject))
      .eq("id", memberProject.props.id)
      .select("id")
      .single();

    if (error) {
      handlePostgresError(error);
    }

    try {
      await this.syncImageRows(
        memberProject.props.id,
        memberProject.props.images,
      );
    } catch (error) {
      await this.restoreImageRows(memberProject.props.id, previousImageRows);
      throw error;
    }

    const fetched = await this.fetchById(data.id);
    if (!fetched) {
      throw new Error(
        `Failed to load updated member project ${memberProject.props.id}.`,
      );
    }

    return fetched;
  }

  async delete(id: string): Promise<void> {
    const existingImageRows = await this.fetchImageRows(id);

    const { error: deleteImagesError } = await (supabase as any)
      .from("member_project_images")
      .delete()
      .eq("memberProjectId", id);

    if (deleteImagesError) {
      handlePostgresError(deleteImagesError);
    }

    const { error } = await (supabase as any)
      .from("member_projects")
      .delete()
      .eq("id", id);

    if (error) {
      await this.restoreImageRows(id, existingImageRows);
      handlePostgresError(error);
    }
  }

  async reorderByMember(
    memberGdgId: string,
    fromIndex: number,
    toIndex: number,
  ): Promise<void> {
    const { data, error } = await (supabase as any)
      .from("member_projects")
      .select("id")
      .eq("memberGdgId", memberGdgId)
      .order("position", { ascending: true })
      .order("createdAt", { ascending: true });

    if (error) {
      handlePostgresError(error);
    }

    const rows = data || [];

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= rows.length ||
      toIndex >= rows.length
    ) {
      throw new ValidationError(
        `Project reorder indices are out of range. Current project count: ${rows.length}.`,
      );
    }

    if (fromIndex === toIndex) {
      return;
    }

    const orderedIds = rows.map((row: { id: string }) => row.id);
    const [movedId] = orderedIds.splice(fromIndex, 1);

    if (!movedId) {
      throw new ValidationError("Unable to reorder member projects.");
    }

    orderedIds.splice(toIndex, 0, movedId);

    for (let index = 0; index < orderedIds.length; index += 1) {
      const currentId = orderedIds[index];

      const { error: updateError } = await (supabase as any)
        .from("member_projects")
        .update({
          position: index,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", currentId)
        .eq("memberGdgId", memberGdgId);

      if (updateError) {
        handlePostgresError(updateError);
      }
    }
  }

  async findById(id: string): Promise<MemberProject | null> {
    return await this.fetchById(id);
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const { data, count, error } = await (supabase as any)
      .from("member_projects")
      .select(this.selectWithRelations, { count: "exact" })
      .range((page - 1) * limit, page * limit - 1);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row: MemberProjectRowWithRelations) =>
        MemberProject.hydrate(this.toProps(row)),
      ),
      count: count || 0,
    };
  }

  async findByMemberGdgId(
    memberGdgId: string,
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const { data, count, error } = await (supabase as any)
      .from("member_projects")
      .select(this.selectWithRelations, { count: "exact" })
      .eq("memberGdgId", memberGdgId)
      .order("position", { ascending: true })
      .order("createdAt", { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row: MemberProjectRowWithRelations) =>
        MemberProject.hydrate(this.toProps(row)),
      ),
      count: count || 0,
    };
  }

  async search(
    queryText: string,
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const { data, count, error } = await (supabase as any)
      .from("member_projects")
      .select(this.selectWithRelations, { count: "exact" })
      .or(`title.ilike.%${queryText}%,description.ilike.%${queryText}%`)
      .range((page - 1) * limit, page * limit - 1);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row: MemberProjectRowWithRelations) =>
        MemberProject.hydrate(this.toProps(row)),
      ),
      count: count || 0,
    };
  }

  async findRandom(
    page: number,
    limit: number,
  ): Promise<{ list: MemberProject[]; count: number }> {
    const { data, count, error } = await (supabase as any)
      .from("member_projects")
      .select(this.selectWithRelations, { count: "exact" })
      .range((page - 1) * limit, page * limit - 1);

    if (error) handlePostgresError(error);

    const shuffled = (data || []).sort(() => Math.random() - 0.5);

    return {
      list: shuffled.map((row: MemberProjectRowWithRelations) =>
        MemberProject.hydrate(this.toProps(row)),
      ),
      count: count || 0,
    };
  }
}
