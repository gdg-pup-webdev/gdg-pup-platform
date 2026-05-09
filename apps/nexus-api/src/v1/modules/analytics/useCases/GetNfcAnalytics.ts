import { INfcScanRepository } from "../domain/INfcScanRepository";
import {
  NfcScan,
  NfcScanInsertProps,
  NfcScanProps,
} from "../domain/NfcScan";
import { NfcAnalytics } from "../domain/NfcAnalytics";

export class GetNfcAnalytics {
  constructor(private readonly scanrepo: INfcScanRepository) {}

  async execute(props: {
    cardId: string;
    pageNumber?: number;
    pageSize?: number;
    days?: number;
  }): Promise<NfcAnalytics> {
    const _props = {
      pageNumber: props.pageNumber || 1,
      pageSize: props.pageSize || 10,
      days: props.days || 7,
    };

    const latestScans = await this.scanrepo.listScansOfNfcCard(
      props.cardId,
      _props.pageNumber,
      _props.pageSize,
    );
    const dailyStats = await this.scanrepo.getDailyStats(props.cardId, _props.days);

    const analytics: NfcAnalytics = {
      date: new Date().toISOString(),
      totalScans: latestScans.count,
      dailyStats,
      latestScans: {
        scans: latestScans.list,
        pageNumber: _props.pageNumber,
        pageSize: _props.pageSize,
        totalScans: latestScans.count,
        totalPages: Math.ceil(latestScans.count / _props.pageSize),
      },
    };

    return analytics;
  }
}
