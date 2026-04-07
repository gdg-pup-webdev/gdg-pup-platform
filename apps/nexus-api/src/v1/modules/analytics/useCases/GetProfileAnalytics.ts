import { IProfileViewRepository } from "../domain/IProfileViewRepository";
import { ProfileViewer } from "../domain/ProfileViewer";
import { ProfileAnalytcs } from "../domain/ProfileAnalytcs";

export class GetProfileAnalytics {
  constructor(private readonly viewrepo : IProfileViewRepository) {}

  async execute(props: {
    gdgId: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<ProfileAnalytcs> {
    const _props = {
      pageNumber: props.pageNumber || 1,
      pageSize: props.pageSize || 10,
    };

    const latestViews = await this.viewrepo.listViews(
      props.gdgId,
      _props.pageNumber,
      _props.pageSize,
    );

    const analytics: ProfileAnalytcs = {
      date: new Date().toISOString(),
      totalViews: latestViews.count,
      latestViews: {
        views: latestViews.list,
        pageNumber: _props.pageNumber,
        pageSize: _props.pageSize,
        totalViews: latestViews.count,
        totalPages: Math.ceil(latestViews.count / _props.pageSize),
      },
    };

    return analytics;
  }
}
