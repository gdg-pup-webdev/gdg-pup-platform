import { IUserCredentialRepository, IUserCredentialReferenceRepository, IOTPService } from "../domain/IAuthenticationInterfaces.js";
import { UserCredential } from "../domain/UserCredential.js";
import { ReferenceCodeType } from "../domain/UserCredentialReferenceCode.js";
import { BadRequestError, ConflictError } from "@/v1/errors/HttpError.js";

export class FinalizeCreateNewUser {
  constructor(
    private readonly credentialRepo: IUserCredentialRepository,
    private readonly referenceRepo: IUserCredentialReferenceRepository,
    private readonly otpService: IOTPService
  ) {}

  async execute(referenceCode: string, otp: string): Promise<boolean> {
    const reference = await this.referenceRepo.findByReferenceCode(referenceCode);
    if (!reference || reference.props.type !== ReferenceCodeType.CREATE_USER) {
      throw new BadRequestError("Invalid or expired reference code.");
    }

    // check if user credential already exists (redundancy check for finalization)
    const existingMember = await this.credentialRepo.findByEmail(reference.props.emailAddress);
    if (existingMember) {
      throw new ConflictError("An account with this email already exists.");
    }

    const isValid = await this.otpService.verifyOtp(reference.props.otpReference, otp);
    if (!isValid) {
      throw new BadRequestError("The OTP you entered is invalid or has already been used.");
    }

    const { emailAddress, payload } = reference.props;

    const credential = UserCredential.create({
      emailAddress, 
      passwordHash: payload.passwordHash,
    });

    await this.credentialRepo.saveNew(credential);
    await this.referenceRepo.deleteByReferenceCode(referenceCode);

    return true;
  }
}

