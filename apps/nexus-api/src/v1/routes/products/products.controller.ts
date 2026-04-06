import { ProductController } from "@/v1/modules/products";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class ProductHttpController {
  constructor(private productModuleController: ProductController) {}

  list: RequestHandler = createExpressController(
    contract.api.v1.products.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const data = await this.productModuleController.list(
        pageNumber,
        pageSize,
      );
      return output(200, {
        status: "success",
        message: "Products list fetched successfully",
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
    contract.api.v1.products.id.GET,
    async ({ input, output, ctx }) => {
      const data = await this.productModuleController.getOne(input.params.id);
      if (!data) throw new Error("Product not found");
      return output(200, data);
    },
  );

  create: RequestHandler = createExpressController(
    contract.api.v1.products.POST,
    async ({ input, output, ctx }) => {
      const data = await this.productModuleController.create(
        input.body.name,
        input.body.description,
        input.body.category,
        input.body.image,
        input.body.link,
      );
      return output(201, data);
    },
  );

  update: RequestHandler = createExpressController(
    contract.api.v1.products.id.PATCH,
    async ({ input, output, ctx }) => {
      const data = await this.productModuleController.update(
        input.params.id,
        input.body,
      );
      return output(200, data);
    },
  );

  delete: RequestHandler = createExpressController(
    contract.api.v1.products.id.DELETE,
    async ({ input, output, ctx }) => {
      await this.productModuleController.delete(input.params.id);
      return output(200, { success: true });
    },
  );
}
