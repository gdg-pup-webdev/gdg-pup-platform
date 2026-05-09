import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { supabase } from "@/v1/lib/supabase";
import { INfcScanRepository } from "../domain/INfcScanRepository";
import { NfcScan } from "../domain/NfcScan";

export class SupabaseNfcScanRepository implements INfcScanRepository {
  private readonly table = "analytics_nfc_card_scans";

  private async resolveCardUuid(id: string): Promise<string> {
    // If it's already a UUID, return it
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return id;

    // Otherwise, try to find the card by its gdg_id
    const { data, error } = await supabase
      .from("nfc_cards")
      .select("id")
      .eq("gdg_id", id)
      .single();

    if (error) {
        // If not found or error, return the original id (it will fail at DB level if invalid)
        return id;
    }

    return data.id;
  }

  async saveNew(scan: NfcScan): Promise<void> {
    const cardId = await this.resolveCardUuid(scan.props.nfcCardId);

    const { error } = await supabase.from(this.table).insert({
      id: scan.props.id,
      date: scan.props.date,
      nfcCardId: cardId,
      scanContext: scan.props.scanContext,
      scannerId: scan.props.scannerId,
    });

    if (error) handlePostgresError(error);
  }

  async listScansOfNfcCard(
    cardId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: NfcScan[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // We filter by checking the nfc_cards table for the gdg_id or id
    // This allows us to pass "GDGPUP-..." and it will correctly match the linked card
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cardId);
    
    let query = supabase
      .from(this.table)
      .select("*, nfc_cards!inner(gdg_id, id)", { count: "exact" });

    if (isUuid) {
        query = query.eq("nfcCardId", cardId);
    } else {
        query = query.eq("nfc_cards.gdg_id", cardId);
    }

    const { data, error, count } = await query
      .order("date", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    const list = (data || []).map((row: any) =>
      NfcScan.hydrate({
        id: row.id,
        date: row.date,
        nfcCardId: row.nfcCardId ?? "",
        scanContext: row.scanContext,
        scannerId: row.scannerId,
      }),
    );

    return { list, count: count || 0 };
  }
  async getDailyStats(
    cardId: string,
    days: number,
  ): Promise<{ date: string; count: number }[]> {
    const resolvedCardId = await this.resolveCardUuid(cardId);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from(this.table)
      .select("date")
      .eq("nfcCardId", resolvedCardId)
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
