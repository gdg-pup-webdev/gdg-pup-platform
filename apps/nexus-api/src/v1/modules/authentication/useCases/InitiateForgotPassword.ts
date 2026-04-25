import { IUserCredentialRepository, IUserCredentialReferenceRepository, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { BadRequestError } from "@/v1/errors/HttpError.js";

export class InitiateForgotPassword {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly otpService: IOTPService
  ) {}

  async execute(email: string): Promise<string> {
    const credential = await this.credentialRepo.findByEmail(email);
    if (!credential) {
      // For security, we should ideally not reveal if a user exists.
      // But for this task, we will just use the correct HttpError.
      throw new BadRequestError("No account found with the provided email address.");
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
