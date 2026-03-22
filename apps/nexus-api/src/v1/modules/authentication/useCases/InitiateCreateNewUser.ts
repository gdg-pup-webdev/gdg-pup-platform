import { IUserCredentialReferenceRepository, IEncryptionService, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";

export class InitiateCreateNewUser {
  constructor(
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly otpService: IOTPService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const passwordHash = await this.encryptionService.hash(password);
    const otpReference = await this.otpService.createAndSendOtpToEmail(email);

    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.CREATE_USER,
      otpReference: otpReference,
      payload: { passwordHash },
    });

    await this.referenceRepo.saveNew(reference);

    return reference.props.referenceCode;
  }
}

