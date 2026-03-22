import { IUserCredentialRepository, IUserCredentialReferenceRepository, IEncryptionService, IOTPService } from "../domain/IAuthenticationInterfaces";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode";

export class InitiateChangePassword {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly otpService: IOTPService
  ) {}

  async execute(email: string, password: string, newPassword: string): Promise<string> {
    const credential = await this.credentialRepo.findByEmail(email);
    if (!credential) {
      throw new Error("Invalid user.");
    }

    const isPasswordValid = await this.encryptionService.compare(password, credential.props.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }

    const newPasswordHash = await this.encryptionService.hash(newPassword);
    const otpReference = await this.otpService.createAndSendOtpToEmail(email);

    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.CHANGE_PASSWORD,
      otpReference: otpReference,
      payload: { newPasswordHash },
    });

    await this.referenceRepo.saveNew(reference);

    return reference.props.referenceCode;
  }
}
