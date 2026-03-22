import { describe, it, expect, beforeEach } from "vitest";
import { FinalizeCreateNewUser } from "../../useCases/FinalizeCreateNewUser";
import { MockUserCredentialRepository } from "./__mocks__/MockUserCredentialRepository";
import { MockUserCredentialReferenceRepository } from "./__mocks__/MockUserCredentialReferenceRepository";
import { MockOtpService } from "./__mocks__/MockOtpService";
import { UserCredentialReferenceCode, ReferenceCodeType } from "../../domain/UserCredentialReferenceCode";

describe("FinalizeCreateNewUser", () => {
  let credentialRepo: MockUserCredentialRepository;
  let referenceRepo: MockUserCredentialReferenceRepository;
  let otpService: MockOtpService;
  let useCase: FinalizeCreateNewUser;

  beforeEach(() => {
    credentialRepo = new MockUserCredentialRepository();
    referenceRepo = new MockUserCredentialReferenceRepository();
    otpService = new MockOtpService();
    useCase = new FinalizeCreateNewUser(credentialRepo, referenceRepo, otpService);
  });

  it("should create a new user when otp is valid", async () => {
    const email = "test@example.com";
    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.CREATE_USER,
      otpReference: "mock-otp-reference",
      payload: { passwordHash: "hashed-password" },
    });
    await referenceRepo.saveNew(reference);

    const result = await useCase.execute(reference.props.referenceCode, "123456");

    expect(result).toBe(true);
    const credential = await credentialRepo.findByEmail(email);
    expect(credential).toBeDefined();
    expect(credential?.props.emailAddress).toBe(email);
  });

  it("should throw an error for invalid otp", async () => {
    const email = "test@example.com";
    const reference = UserCredentialReferenceCode.create({
      emailAddress: email,
      type: ReferenceCodeType.CREATE_USER,
      otpReference: "mock-otp-reference",
      payload: { passwordHash: "hashed-password" },
    });
    await referenceRepo.saveNew(reference);

    await expect(useCase.execute(reference.props.referenceCode, "wrong-otp")).rejects.toThrow("Invalid OTP.");
  });
});
