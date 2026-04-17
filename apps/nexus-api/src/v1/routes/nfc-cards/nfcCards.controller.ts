import { UnauthorizedError } from "@/v1/errors/HttpError";
import { NfcCardsModuleController } from "@/v1/modules/nfcCards";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class NfcCardsHttpController {
  constructor(
    private readonly nfccardsmodulecontroller: NfcCardsModuleController,
  ) {}

  updateDestinationUrl: RequestHandler = createExpressController(
    contract.api.v1.nfc_cards.cardId.destination_url.POST,
    async ({ input, output, ctx }) => {
      const actorGdgId = ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id
      if (!actorGdgId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }
      const card = await this.nfccardsmodulecontroller.setDestinationUrl(
        actorGdgId,
        input.params.cardId,
        input.body.data.destinationUrl,
      );
      return output(200, {
        status: "success",
        message: "NFC card updated successfully",
        data: card,
      });
    }, 
  )

  listCardsOfUser : RequestHandler = createExpressController(
    contract.api.v1.nfc_cards.GET,
    async ({ input, output, ctx }) => {
      const actorGdgId = ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id
      if (!actorGdgId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const gdgId = input.query.gdgId;
      const result = await this.nfccardsmodulecontroller.listCardsOfUser(
        actorGdgId,
        gdgId,
      );
      return output(200, {
        status: "success",
        message: "NFC cards fetched successfully",
        data: result 
      });
    },
  )

  createCard: RequestHandler = createExpressController(
    contract.api.v1.nfc_cards.POST,
    async ({ input, output }) => {
      const card = await this.nfccardsmodulecontroller.createCard(
        input.body.data.ownerGdgId,
        input.body.data.notes,
      );
      return output(200, {
        status: "success",
        message: "NFC card created successfully",
        data: card,
      });
    },
  );

  activateCard: RequestHandler = createExpressController(
    contract.api.v1.nfc_cards.cardId.activate.POST,
    async ({ input, output, ctx }) => {
      const actorGdgId = ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id
      if (!actorGdgId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const card = await this.nfccardsmodulecontroller.activateCard(
        input.params.cardId,
        actorGdgId,
      );
      return output(200, {
        status: "success",
        message: "NFC card activated successfully",
        data: card,
      });
    },
  );

  getCard: RequestHandler = createExpressController(
    contract.api.v1.nfc_cards.cardId.GET,
    async ({ input, output }) => {
      const card = await this.nfccardsmodulecontroller.getCard(
        input.params.cardId,
      );
      return output(200, {
        status: "success",
        message: "NFC card fetched successfully",
        data: card,
      });
    },
  );

  getStatus: RequestHandler = createExpressController(
    contract.api.v1.nfc_cards.cardId.status.GET,
    async ({ input, output }) => {
      const status = await this.nfccardsmodulecontroller.getCardStatus(
        input.params.cardId,
      );
      return output(200, {
        status: "success",
        message: "NFC card status fetched successfully",
        data: status,
      });
    },
  );
}
