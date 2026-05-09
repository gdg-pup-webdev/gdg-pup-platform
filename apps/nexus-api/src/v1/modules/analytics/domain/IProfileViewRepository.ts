import { NfcScan } from "./NfcScan";
import { ProfileViewer } from "./ProfileViewer";

export abstract class IProfileViewRepository {
  abstract saveNew(scan: ProfileViewer): Promise<void>;
  abstract listViews(
    gdgId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{
    list: ProfileViewer[];
    count: number;
  }>;
  abstract getDailyStats(
    gdgId: string,
    days: number,
  ): Promise<{ date: string; count: number }[]>;
}
