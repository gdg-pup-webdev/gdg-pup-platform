import { IUserCredentialRepository, IUserCredentialReferenceRepository, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { UserCredential } from "../domain/UserCredential.js";
import { ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";

export class FinalizeCreateNewUser {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly otpService: IOTPService
  ) {}

  async execute(referenceCode: string, otp: string): Promise<boolean> {
    const reference = await this.referenceRepo.findByReferenceCode(referenceCode);
    if (!reference || reference.props.type !== ReferenceCodeType.CREATE_USER) {
      throw new Error("Invalid reference code.");
    }

    const isValid = await this.otpService.verifyOtp(reference.props.otpReference, otp);
    if (!isValid) {
      throw new Error("Invalid OTP.");
    }

    const { emailAddress, payload } = reference.props;
    const username = emailAddress.split("@")[0];

    const credential = UserCredential.create({
      emailAddress, 
      passwordHash: payload.passwordHash,
    });

    await this.credentialRepo.saveNew(credential);
    await this.referenceRepo.deleteByReferenceCode(referenceCode);

    return true;
  }
}

