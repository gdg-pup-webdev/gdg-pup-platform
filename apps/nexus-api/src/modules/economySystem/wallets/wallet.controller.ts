import {
  WalletService,
  walletServiceInstance,
} from "@/modules/economySystem/wallets/wallet.service";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

/**
 * Controller for handling wallet-related HTTP requests.
 * Implements endpoints defined in the economy system contract.
 */
export class WalletController {
  constructor(
    private readonly walletService: WalletService = walletServiceInstance,
  ) {}

  /**
   * Retrieves a specific wallet by ID.
   * @todo Implement this method.
   */
  getWallet: RequestHandler = (req, res) => {
    const walletId = req.params.walletId;

    // get wallet by id service

    return res.status(500).json({ message: "not implemented" });
  };

  /**
   * Lists wallets with optional filtering and pagination.
   *
   * @route GET /api/economy-system/wallets
   * @returns JSON response containing the list of wallets and pagination metadata.
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error.
   */
  listWallets: RequestHandler = createExpressController(
    contract.api.economy_system.wallets.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      // getting filters
      const userId = input.query.userId || null;

      const data = await this.walletService.listWalletsWithFilters(
        pageNumber,
        pageSize,
        {
          userId,
        },
      );

      const list = data.list;
      const count = data.count;

      return output(200, {
        status: "success",
        message: "Wallets fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          totalPages: Math.ceil(count / input.query.pageSize),
          currentPage: input.query.pageNumber,
          pageSize: input.query.pageSize,
        },
      });
    },
  );
}

export const walletControllerInstance = new WalletController();
