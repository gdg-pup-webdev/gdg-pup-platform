import { OneTimePin } from "../domain/OneTimePin";
import { IOTPRepository } from "../domain/IOneTimePinInterfaces";

export class MockOTPRepository implements IOTPRepository {
  private otps: Map<string, OneTimePin> = new Map();

  async saveNew(otp: OneTimePin): Promise<OneTimePin> {
    this.otps.set(otp.props.reference, otp);
    return otp;
  }

  async findByReference(reference: string): Promise<OneTimePin | null> {
    return this.otps.get(reference) || null;
  }

  async persistUpdates(otp: OneTimePin): Promise<OneTimePin> {
    this.otps.set(otp.props.reference, otp);
    return otp;
  }
}
