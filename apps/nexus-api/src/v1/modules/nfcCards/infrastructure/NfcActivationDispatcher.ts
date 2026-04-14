import { mailerController, NfcActivationEmailTemplate } from "@/v1/modules/mailer";
import { INfcActivationEventDispatcher } from "../domain/INfcActivationEventDispatcher";
import { gdgMembersController } from "@/v1/modules/members";
import { configs } from "@/configs/configs";

export class NfcActivationDispatcher implements INfcActivationEventDispatcher {
  async dispatchActivationSuccess(
    ownerGdgId: string,
    cardId: string,
  ): Promise<void> {
    try {
      const member = await gdgMembersController.findByGdgId(ownerGdgId);
      if (!member) {
        throw new Error(`Member with gdgId ${ownerGdgId} not found`);
      }

      await mailerController.sendEmail(
        member.email,
        "Your Nexus Card is Activated!",
        NfcActivationEmailTemplate.render(
          member.firstName,
          member.gdgId,
          cardId,
          configs.clientBaseUrl ?? "https://gdgpup.org",
        ),
      );

      console.log(`[NfcActivationDispatcher] Successfully dispatched activation email to ${member.email}`);
    } catch (error) {
       console.error(`[NfcActivationDispatcher] Failed to dispatch email for ${ownerGdgId}:`, error);
    }
  }
}
