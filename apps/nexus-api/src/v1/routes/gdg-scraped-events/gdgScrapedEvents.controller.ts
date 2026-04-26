import { BevyEventController } from "@/v1/modules/bevyEvents/BevyEventController";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class GdgScrapedEventsHttpController {
  constructor(private bevyEventsModuleController: BevyEventController) {}

  list: RequestHandler = createExpressController(
    contract.api.v1.gdg_scraped_events.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const data = await this.bevyEventsModuleController.list(
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: "Events fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize: pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      }); 
    },
  );

  getOne: RequestHandler = createExpressController(
    contract.api.v1.gdg_scraped_events.gdg_id.GET,
    async ({ input, output }) => {
      const gdgId = input.params.gdg_id;
      const data = await this.bevyEventsModuleController.getById(gdgId);

      if (!data) {
        return output(404, {
          status: "fail",
          message: "Event not found",
          errors: [
            {
              title: "Not Found",
              detail: `Bevy Event with ID ${gdgId} not found`,
            },
          ],
        });
      }

      return output(200, {
        status: "success",
        message: "Event fetched successfully",
        data: data,
      });
    },
  );

  sync: RequestHandler = createExpressController(
    contract.api.v1.gdg_scraped_events.sync.POST,
    async ({ output }) => {
      const syncedCount = await this.bevyEventsModuleController.sync();

      return output(200, {
        status: "success",
        message: "Events synced successfully",
        data: {
          syncedCount,
        },
      });
    },
  );
}
