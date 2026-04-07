import { analyticsController as analyticsModuleController } from "@/v1/modules/analytics";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class AnalyticsHttpController {
  constructor(
    private readonly analyticsmodulecontroller = analyticsModuleController,
  ) {}

  postNfcScans: RequestHandler = createExpressController(
    contract.api.v1.analytics.nfc_scans.POST,
    async ({ input, output }) => {
      const result = await this.analyticsmodulecontroller.nfcCardScanned(
        input.body.data,
      );
      return output(201, {
        status: "success",
        message: "NFC scan recorded successfully",
        data: result,
      });
    },
  );

  getNfcScansCardId: RequestHandler = createExpressController(
    contract.api.v1.analytics.nfc_scans.cardId.GET,
    async ({ input, output }) => {
      const result = await this.analyticsmodulecontroller.getNfcAnalytics({
        cardId: input.params.cardId,
        pageNumber: input.query.pageNumber,
        pageSize: input.query.pageSize,
      });
      return output(200, {
        status: "success",
        message: "NFC analytics fetched successfully",
        data: result,
      });
    },
  );

  postProfileViews: RequestHandler = createExpressController(
    contract.api.v1.analytics.profile_views.POST,
    async ({ input, output }) => {
      const result = await this.analyticsmodulecontroller.profileVisited(
        input.body.data,
      );
      return output(201, {
        status: "success",
        message: "Profile view recorded successfully",
        data: result,
      });
    },
  );

  getProfileViewsGdgId: RequestHandler = createExpressController(
    contract.api.v1.analytics.profile_views.gdgId.GET,
    async ({ input, output }) => {
      const result = await this.analyticsmodulecontroller.getProfileAnalytics({
        gdgId: input.params.gdgId,
        pageNumber: input.query.pageNumber,
        pageSize: input.query.pageSize,
      });
      return output(200, {
        status: "success",
        message: "Profile analytics fetched successfully",
        data: result,
      });
    },
  );
}
