import { GetNfcAnalytics } from "./useCases/GetNfcAnalytics";
import { GetProfileAnalytics } from "./useCases/GetProfileAnalytics";
import { NfcCardScanned } from "./useCases/NfcCardScanned";
import { ProfileVisited } from "./useCases/ProfileVisited";
import { NfcScanInsertProps } from "./domain/NfcScan";
import { ProfileViewerInsertProps } from "./domain/ProfileViewer";

export class AnalyticsController {
  constructor(
    private readonly getNfcAnalyticsUseCase: GetNfcAnalytics,
    private readonly getProfileAnalyticsUseCase: GetProfileAnalytics,
    private readonly nfcCardScannedUseCase: NfcCardScanned,
    private readonly profileVisitedUseCase: ProfileVisited,
  ) {}

  async getNfcAnalytics(props: {
    cardId: string;
    pageNumber?: number;
    pageSize?: number;
  }) {
    const analytics = await this.getNfcAnalyticsUseCase.execute(props);

    return {
      date: analytics.date,
      totalScans: analytics.totalScans,
      latestScans: {
        scans: analytics.latestScans.scans.map((scan) => ({
          id: scan.props.id,
          date: scan.props.date,
          nfcCardId: scan.props.nfcCardId,
          scanContext: scan.props.scanContext,
          scannerId: scan.props.scannerId,
        })),
        pageNumber: analytics.latestScans.pageNumber,
        pageSize: analytics.latestScans.pageSize,
        totalScans: analytics.latestScans.totalScans,
        totalPages: analytics.latestScans.totalPages,
      },
    };
  }

  async getProfileAnalytics(props: {
    gdgId: string;
    pageNumber?: number;
    pageSize?: number;
  }) {
    const analytics = await this.getProfileAnalyticsUseCase.execute({
        gdgId: props.gdgId,
        pageNumber: props.pageNumber,
        pageSize: props.pageSize
    });

    return {
      date: analytics.date,
      totalViews: analytics.totalViews,
      latestViews: {
        views: analytics.latestViews.views.map((view) => ({
          id: view.props.id,
          date: view.props.date,
          viewerGdgId: view.props.viewerGdgId,
          profileGdgId: view.props.profileGdgId,
          user_agent: view.props.user_agent,
          source: view.props.source,
        })),
        pageNumber: analytics.latestViews.pageNumber,
        pageSize: analytics.latestViews.pageSize,
        totalViews: analytics.latestViews.totalViews,
        totalPages: analytics.latestViews.totalPages,
      },
    };
  }

  async nfcCardScanned(props: {
    ownerGdgId: string;
    scanContext?: string | null;
    scannerId?: string | null;
  }) {
    const scan = await this.nfcCardScannedUseCase.execute(props);

    return {
      id: scan.props.id,
      date: scan.props.date,
      nfcCardId: scan.props.nfcCardId,
      scanContext: scan.props.scanContext,
      scannerId: scan.props.scannerId,
    };
  }

  async profileVisited(props: ProfileViewerInsertProps) {
    const view = await this.profileVisitedUseCase.execute(props);

    return {
      id: view.props.id,
      date: view.props.date,
      viewerGdgId: view.props.viewerGdgId,
      profileGdgId: view.props.profileGdgId,
      user_agent: view.props.user_agent,
      source: view.props.source,
    };
  }
}
