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
  async getDailyStats(
    gdgId: string,
    days: number,
  ): Promise<{ date: string; count: number }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from(this.table)
      .select("date")
      .eq("profileGdgId", gdgId)
      .gte("date", startDate.toISOString());

    if (error) handlePostgresError(error);

    // Group by date (YYYY-MM-DD) in local time to avoid timezone offset issues
    const statsMap = new Map<string, number>();
    
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Initialize map with all days
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      statsMap.set(formatDate(d), 0);
    }

    // Count occurrences
    (data || []).forEach((row: any) => {
      const rowDate = new Date(row.date);
      const dateStr = formatDate(rowDate);
      if (statsMap.has(dateStr)) {
        statsMap.set(dateStr, statsMap.get(dateStr)! + 1);
      }
    });

    // Convert to array sorted by date
    return Array.from(statsMap.entries()).map(([date, count]) => ({
      date,
      count,
    })).sort((a, b) => a.date.localeCompare(b.date));
  }
}
