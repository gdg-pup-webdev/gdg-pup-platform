import { IUserCredentialRepository, IUserCredentialReferenceRepository, IEncryptionService, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { BadRequestError, UnauthorizedError } from "@/v1/errors/HttpError.js";

export class InitiateChangeEmail {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly otpService: IOTPService
  ) {}

  async execute(email: string, password: string, newEmail: string): Promise<string> {
    const credential = await this.credentialRepo.findByEmail(email);
    if (!credential) {
      throw new BadRequestError("The requested account does not exist.");
    }

    const isPasswordValid = await this.encryptionService.compare(password, credential.props.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("The password you entered is incorrect.");
    }

    // Usually OTP is sent to the NEW email to verify ownership
    const otpReference = await this.otpService.createAndSendOtpToEmail(email, "Change Email");

    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.CHANGE_EMAIL,
      otpReference: otpReference,
      payload: { newEmail },
    });

    await this.referenceRepo.saveNew(reference);

    return reference.props.referenceCode;
  }
}

