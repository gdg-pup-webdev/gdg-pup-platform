import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { supabase } from "@/v1/lib/supabase";
import { IProfileViewRepository } from "../domain/IProfileViewRepository";
import { ProfileViewer } from "../domain/ProfileViewer";

export class SupabaseProfileViewRepository implements IProfileViewRepository {
  private readonly table = "analytics_profile_views";

  async saveNew(viewer: ProfileViewer): Promise<void> {
    const { error } = await supabase.from(this.table).insert({
      id: viewer.props.id,
      date: viewer.props.date,
      viewerGdgId: viewer.props.viewerGdgId,
      profileGdgId: viewer.props.profileGdgId,
      user_agent: viewer.props.user_agent,
      source: viewer.props.source,
    } as any);

    if (error) handlePostgresError(error);
  }

  async listViews(
    gdgId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: ProfileViewer[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .eq("profileGdgId", gdgId)
      .order("date", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    const list = (data || []).map((row: any) =>
      ProfileViewer.hydrate({
        id: row.id,
        date: row.date,
        viewerGdgId: row.viewerGdgId,
        profileGdgId: row.profileGdgId ?? "",
        user_agent: row.user_agent ?? "",
        source: row.source ?? "",
      }),
    );

    return { list, count: count || 0 };
  }
}
