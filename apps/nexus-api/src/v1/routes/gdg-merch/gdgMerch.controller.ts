import { GdgMerchController } from "@/v1/modules/gdgMerch";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class GdgMerchHttpController {
  constructor(private gdgMerchModuleController: GdgMerchController) {}

  list: RequestHandler = createExpressController(
    contract.api.v1.gdg_merch.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const data = await this.gdgMerchModuleController.list(pageNumber, pageSize);
      return output(200, {
        list: data.list,
        count: data.count,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize: pageSize,
          totalPages: Math.ceil(data.count / pageSize)
        }
      } as any);
    }
  );

  getOne: RequestHandler = createExpressController(
    contract.api.v1.gdg_merch.id.GET,
    async ({ input, output, ctx }) => {
      const data = await this.gdgMerchModuleController.getOne(input.params.id);
      if (!data) throw new Error("Not found");
      return output(200, data);
    }
  );

  create: RequestHandler = createExpressController(
    contract.api.v1.gdg_merch.POST,
    async ({ input, output, ctx }) => {
      const data = await this.gdgMerchModuleController.create(
        input.body.name, input.body.image, input.body.points, input.body.stock
      );
      return output(201, data);
    }
  );

  updateInfo: RequestHandler = createExpressController(
    contract.api.v1.gdg_merch.id.PATCH,
    async ({ input, output, ctx }) => {
      const data = await this.gdgMerchModuleController.updateInfo(
        input.params.id, input.body.name, input.body.image, input.body.points
      );
      return output(200, data);
    }
  );

  delete: RequestHandler = createExpressController(
    contract.api.v1.gdg_merch.id.DELETE,
    async ({ input, output, ctx }) => {
      await this.gdgMerchModuleController.delete(input.params.id);
      return output(200, { success: true });
    }
  );

  redeem: RequestHandler = createExpressController(
    contract.api.v1.gdg_merch.id.redeem.POST,
    async ({ input, output, ctx }) => {
      const data = await this.gdgMerchModuleController.redeem(input.body.userId, input.params.id);
      return output(200, data);
    }
  );

  restock: RequestHandler = createExpressController(
    contract.api.v1.gdg_merch.id.restock.POST,
    async ({ input, output, ctx }) => {
      const data = await this.gdgMerchModuleController.restock(input.params.id, input.body.amount);
      return output(200, data);
    }
  );
}
