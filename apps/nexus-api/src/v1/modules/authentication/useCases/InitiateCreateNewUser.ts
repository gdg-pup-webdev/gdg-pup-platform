import { IUserCredentialReferenceRepository, IEncryptionService, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { IMemberCheckService } from "../domain/IMemberCheckService.js";

export class InitiateCreateNewUser {
  constructor(
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly encryptionService: IEncryptionService,
    private readonly otpService: IOTPService,
    private readonly memberCheckService: IMemberCheckService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const isMember = await this.memberCheckService.isMember(email);
    if (!isMember) {
      throw new Error("Only GDG members are allowed to create accounts.");
    }

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

