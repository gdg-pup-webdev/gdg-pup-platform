import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { supabase } from "@/v1/lib/supabase";
import { INfcScanRepository } from "../domain/INfcScanRepository";
import { NfcScan } from "../domain/NfcScan";

export class SupabaseNfcScanRepository implements INfcScanRepository {
  private readonly table = "analytics_nfc_card_scans";

  async saveNew(scan: NfcScan): Promise<void> {
    const { error } = await supabase.from(this.table).insert({
      id: scan.props.id,
      date: scan.props.date,
      nfcCardId: scan.props.nfcCardId,
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

    const { data, error, count } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .eq("nfcCardId", cardId)
      .order("date", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    const list = (data || []).map((row) =>
      NfcScan.hydrate({
        id: row.id,
        date: row.date,
        nfcCardId: row.nfcCardId,
        scanContext: row.scanContext,
        scannerId: row.scannerId,
      }),
    );

    return { list, count: count || 0 };
  }
}
