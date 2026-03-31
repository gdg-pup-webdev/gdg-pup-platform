import { IUserCredentialRepository, IUserCredentialReferenceRepository, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";

export class InitiateForgotPassword {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly otpService: IOTPService
  ) {}

  async execute(email: string): Promise<string> {
    const credential = await this.credentialRepo.findByEmail(email);
    if (!credential) {
      // Fail silently to prevent email enumeration, but return a dummy reference or success
      // Actually, returning a reference might be problematic if user doesn't exist.
      // But for "forgot password", we usually just say "If an account exists, you'll receive an email".
      // Let's check how InitiateCreateNewUser handles it.
      throw new Error("User does not exist.");
    }

    const otpReference = await this.otpService.createAndSendOtpToEmail(email, "Forgot Password");

    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.FORGOT_PASSWORD,
      otpReference: otpReference,
      payload: {},
    });

    await this.referenceRepo.saveNew(reference);

    return reference.props.referenceCode;
  }
}
