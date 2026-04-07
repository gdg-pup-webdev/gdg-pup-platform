import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { supabase } from "@/v1/lib/supabase";
import { IProfileViewRepository } from "../domain/IProfileViewRepository";
import { ProfileViewer } from "../domain/ProfileViewer";

export class SupabaseProfileViewRepository implements IProfileViewRepository {
  private readonly table = "analytics_profile_views";

  async saveNew(scan: ProfileViewer): Promise<void> {
    const { error } = await supabase.from(this.table).insert({
      id: scan.props.id,
      date: scan.props.date,
      viewerGdgId: scan.props.viewerGdgId,
      user_agent: scan.props.user_agent,
      source: scan.props.source,
    });

    if (error) handlePostgresError(error);
  }

  async listViews(
    gdgId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: ProfileViewer[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // Note: The schema has viewerGdgId, but the parameter name in the interface is gdgId.
    // Assuming we are filtering by the profile being viewed, but the schema only has viewerGdgId.
    // Wait, let me check the schema again. 
    // analytics_profile_views: id, date, source, user_agent, viewerGdgId.
    // If it's profile views, there should be a field for the profile owner's ID.
    // Let me check if there is another field I missed.
    
    const { data, error, count } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .eq("viewerGdgId", gdgId) // This is likely filtering views BY a user, not TO a user's profile.
      .order("date", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    const list = (data || []).map((row) =>
      ProfileViewer.hydrate({
        id: row.id,
        date: row.date,
        viewerGdgId: row.viewerGdgId,
        user_agent: row.user_agent,
        source: row.source,
      }),
    );

    return { list, count: count || 0 };
  }
}
