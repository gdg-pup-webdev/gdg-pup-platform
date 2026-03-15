import { UnauthorizedError } from "@/v1/errors/HttpError";
import { SparkmatesModuleController } from "@/v1/modules/sparkmatesModule";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class NfcSystemHttpController {
  constructor(
    private readonly sparkmatesModuleController: SparkmatesModuleController,
  ) {}

  getNfcStatusByGdgId: RequestHandler = createExpressController(
    contract.api.v1.nfc_system.nfc.gdgId.status.GET,
    async ({ input, output }) => {
      const card = await this.sparkmatesModuleController.getCardStatusByGdgId(
        input.params.gdgId,
      );

      return output(200, {
        status: "success",
        message: "NFC status fetched successfully",
        data: {
          gdg_id: card.gdgId,
          status: card.status,
          is_public: card.isPublic,
        },
      });
    },
  );

  activateNfcByGdgId: RequestHandler = createExpressController(
    contract.api.v1.nfc_system.nfc.gdgId.activate.POST,
    async ({ input, output, ctx }) => {
      const actorUserId = ctx.req.user?.id;
      if (!actorUserId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const card = await this.sparkmatesModuleController.activateCardByGdgId(
        input.params.gdgId,
        actorUserId,
      );

      return output(200, {
        status: "success",
        message: "NFC activated successfully",
        data: {
          gdg_id: card.gdgId,
          status: "activated",
          is_public: true,
        },
      });
    },
  );

  registerNfc: RequestHandler = createExpressController(
    contract.api.v1.nfc_system.nfc.register.POST,
    async ({ input, output }) => {
      const card = await this.sparkmatesModuleController.registerCardByGdgId({
        gdgId: input.body.data.gdg_id,
        ownerUserId: input.body.data.owner_user_id,
        notes: input.body.data.notes,
      });

      return output(201, {
        status: "success",
        message: "NFC registered successfully",
        data: {
          gdg_id: card.gdgId,
          owner_user_id: card.ownerUserId,
          status: card.status,
        },
      });
    },
  );

  registerNfcBulk: RequestHandler = createExpressController(
    contract.api.v1.nfc_system.nfc.register_bulk.POST,
    async ({ input, output }) => {
      const result = await this.sparkmatesModuleController.registerCardsBulk({
        cards: input.body.data.cards.map((card) => ({
          gdgId: card.gdg_id,
          ownerUserId: card.owner_user_id,
          notes: card.notes,
        })),
      });

      return output(200, {
        status: "success",
        message:
          result.failed.length === 0
            ? "NFC bulk registration completed"
            : "NFC bulk registration completed with partial failures",
        data: {
          registered: result.registered.map((card) => ({
            gdg_id: card.gdgId,
            owner_user_id: card.ownerUserId,
            status: card.status,
          })),
          failed: result.failed.map((item) => ({
            gdg_id: item.gdgId,
            error: item.error,
          })),
        },
      });
    },
  );
}
