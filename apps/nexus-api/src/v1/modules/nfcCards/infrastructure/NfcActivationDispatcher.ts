import { mailerController } from "@/v1/modules/mailer";
import { INfcActivationEventDispatcher } from "../domain/INfcActivationEventDispatcher";
import { gdgMembersController } from "@/v1/modules/members";

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
        "Your Nexus Card is Activated! 🎉",
        `Hi ${member.firstName},\n\nYour physical Nexus Card (${cardId}) has been successfully activated and permanently linked to your digital identity.\n\nYou can now tap your card to share your Sparkmates profile at any event!`,
      );

      console.log(`[NfcActivationDispatcher] Successfully dispatched activation email to ${member.email}`);
    } catch (error) {
       console.error(`[NfcActivationDispatcher] Failed to dispatch email for ${ownerGdgId}:`, error);
    }
  }
}
