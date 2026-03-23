import { IOTPRepository } from "../domain/IOneTimePinInterfaces";

export class VerifyOtp {
  constructor(private readonly repo: IOTPRepository) {}

  async execute(reference: string, otp: string): Promise<boolean> {
    const otpEntity = await this.repo.findByReference(reference);
    if (!otpEntity) return false;

    if (otpEntity.verify(otp)) {
      otpEntity.use();
      await this.repo.persistUpdates(otpEntity);
      return true;
    }

    return false;
  }
}
