import { NfcScan } from "./NfcScan";

export abstract class INfcScanRepository {
  abstract saveNew(scan: NfcScan): Promise<void>;
  abstract listScansOfNfcCard(
    cardId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{
    list: NfcScan[];
    count: number;
  }>;
}
