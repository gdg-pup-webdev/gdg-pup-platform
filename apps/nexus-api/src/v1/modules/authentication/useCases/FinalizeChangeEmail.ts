import { IUserCredentialRepository, IUserCredentialReferenceRepository, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";

export class FinalizeChangeEmail {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly otpService: IOTPService
  ) {}

  async execute(referenceCode: string, otp: string): Promise<boolean> {
    const reference = await this.referenceRepo.findByReferenceCode(referenceCode);
    if (!reference || reference.props.type !== ReferenceCodeType.CHANGE_EMAIL) {
      throw new Error("Invalid reference code.");
    }

    const isValid = await this.otpService.verifyOtp(reference.props.otpReference, otp);
    if (!isValid) {
      throw new Error("Invalid OTP.");
    }

    const credential = await this.credentialRepo.findByEmail(reference.props.emailAddress);
    if (!credential) {
      throw new Error("User not found.");
    }

    credential.updateEmail(reference.props.payload.newEmail);
    // Optionally update username if it was based on email
    const newUsername = reference.props.payload.newEmail.split("@")[0];
    credential.updateUsername(newUsername);

    await this.credentialRepo.persistUpdates(credential);
    await this.referenceRepo.deleteByReferenceCode(referenceCode);

    return true;
  }
}

