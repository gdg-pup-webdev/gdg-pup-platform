import { INfcScanRepository } from "../domain/INfcScanRepository";
import { IProfileViewRepository } from "../domain/IProfileViewRepository";
import {
  NfcScan,
  NfcScanInsertProps,
  NfcScanProps,
} from "../domain/NfcScan";
import {
    ProfileViewer,
  ProfileViewerInsertProps,
} from "../domain/ProfileViewer";
import { ProfileAnalytcs } from "../domain/ProfileAnalytcs";

export class GetProfileAnalytics {
  constructor(private readonly viewrepo : IProfileViewRepository) {}

  async execute(props: {
    cardId: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<ProfileAnalytcs> {
    const _props = {
      pageNumber: props.pageNumber || 1,
      pageSize: props.pageSize || 10,
    };

    const latestScans = await this.viewrepo.listViews(
      props.cardId,
      _props.pageNumber,
      _props.pageSize,
    );

    const analytics: ProfileAnalytcs = {
      date: new Date().toISOString(),
      totalViews: latestScans.count,
      latestViews: {
        views: latestScans.list,
        pageNumber: _props.pageNumber,
        pageSize: _props.pageSize,
        totalViews: latestScans.count,
        totalPages: Math.ceil(latestScans.count / _props.pageSize),
      },
    };

    return analytics;
  }
}
