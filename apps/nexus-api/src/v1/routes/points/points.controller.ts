import { PointSystemController } from "@/v1/modules/pointsSystem/PointSystemController";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class PointsHttpController {
  constructor(private readonly pointSystemController: PointSystemController) {}

  getWallet: RequestHandler = createExpressController(
    contract.api.v1.points.userId.GET,
    async ({ input, output }) => {
      const wallet = await this.pointSystemController.getWallet(
        input.params.userId,
      );
      if (!wallet) throw new Error("Wallet not found");
      return output(200, wallet as any);
    },
  );

  getHistory: RequestHandler = createExpressController(
    contract.api.v1.points.userId.history.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const result = await this.pointSystemController.getHistory(
        input.params.userId,
        pageNumber,
        pageSize,
      );
      return output(200, {
        list: result.list,
        count: result.count,
        meta: {
          totalRecords: result.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(result.count / pageSize),
        },
      } as any);
    },
  );

  givePoints: RequestHandler = createExpressController(
    contract.api.v1.points.userId.give.POST,
    async ({ input, output }) => {
      const result = await this.pointSystemController.givePoints(
        input.params.userId,
        input.body.entries,
      );
      return output(200, result as any);
    },
  );

  consumePoints: RequestHandler = createExpressController(
    contract.api.v1.points.userId.consume.POST,
    async ({ input, output }) => {
      const result = await this.pointSystemController.consumePoints(
        input.params.userId,
        input.body.entries,
      );
      return output(200, result as any);
    },
  );

  getTransaction: RequestHandler = createExpressController(
    contract.api.v1.points.transactions.transactionId.GET,
    async ({ input, output }) => {
      const transaction = await this.pointSystemController.getTransaction(
        input.params.transactionId,
      );
      if (!transaction) throw new Error("Transaction not found");
      return output(200, transaction as any);
    },
  );
}
