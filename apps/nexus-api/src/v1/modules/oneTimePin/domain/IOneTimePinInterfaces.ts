import { OneTimePin } from "./OneTimePin";

export interface IOTPRepository {
  saveNew(otp: OneTimePin): Promise<OneTimePin>;
  findByReference(reference: string): Promise<OneTimePin | null>;
  persistUpdates(otp: OneTimePin): Promise<OneTimePin>;
}

export interface IOTPMailerService {
  sendOtp(email: string, otp: string): Promise<void>;
}
