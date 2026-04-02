import { IUserCredentialReferenceRepository, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";

export class ResendOtp {
  constructor(
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly otpService: IOTPService
  ) {}

  async execute(referenceCode: string): Promise<boolean> {
    const reference = await this.referenceRepo.findByReferenceCode(referenceCode);
    if (!reference) {
      throw new Error("Invalid reference code.");
    }

    let context = "Verification";
    switch (reference.props.type) {
      case ReferenceCodeType.CREATE_USER:
        context = "Sign up";
        break;
      case ReferenceCodeType.FORGOT_PASSWORD:
        context = "Forgot Password";
        break;
      case ReferenceCodeType.CHANGE_PASSWORD:
        context = "Change Password";
        break;
      case ReferenceCodeType.CHANGE_EMAIL:
        context = "Change Email";
        break;
    }

    const newOtpReference = await this.otpService.createAndSendOtpToEmail(
      reference.props.emailAddress,
      context
    );

    reference.updateOtpReference(newOtpReference);
    await this.referenceRepo.persistUpdates(reference);

    return true;
  }
}
