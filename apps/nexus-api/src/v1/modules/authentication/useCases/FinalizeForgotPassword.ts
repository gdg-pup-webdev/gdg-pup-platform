import { IUserCredentialRepository, IUserCredentialReferenceRepository, IEncryptionService, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { BadRequestError, NotFoundError } from "@/v1/errors/HttpError.js";

export class FinalizeForgotPassword {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly otpService: IOTPService
  ) {}

  async execute(referenceCode: string, otpCode: string, newPassword: string): Promise<void> {
    const reference = await this.referenceRepo.findByReferenceCode(referenceCode);
    if (!reference || reference.props.type !== ReferenceCodeType.FORGOT_PASSWORD) {
      throw new BadRequestError("Invalid or expired reference code.");
    }

    const isValidOtp = await this.otpService.verifyOtp(reference.props.otpReference, otpCode);
    if (!isValidOtp) {
      throw new BadRequestError("The OTP code you entered is invalid or has already been used.");
    }

    const credential = await this.credentialRepo.findByEmail(reference.props.emailAddress);
    if (!credential) {
      throw new NotFoundError("User account not found.");
    }

    const newPasswordHash = await this.encryptionService.hash(newPassword);
    credential.updatePassword(newPasswordHash);

    await this.credentialRepo.persistUpdates(credential);
    await this.referenceRepo.deleteByReferenceCode(referenceCode);
  }
}
