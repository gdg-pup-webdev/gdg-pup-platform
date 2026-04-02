import { SupabaseOTPRepository } from "./infrastructure/SupabaseOTPRepository";
import { OneTimePinMailerService } from "./infrastructure/OneTimePinMailerService";
import { CreateAndSendOtpToEmail } from "./useCases/CreateAndSendOtpToEmail";
import { VerifyOtp } from "./useCases/VerifyOtp";
import { OneTimePinController } from "./OneTimePinController";

const repo = new SupabaseOTPRepository();
const mailer = new OneTimePinMailerService();

const createAndSendUC = new CreateAndSendOtpToEmail(repo, mailer);
const verifyUC = new VerifyOtp(repo);

export const oneTimePinController = new OneTimePinController(createAndSendUC, verifyUC);

export { OneTimePinController };
export * from "./domain/OneTimePin";
export * from "./domain/IOneTimePinInterfaces";
export * from "./useCases/CreateAndSendOtpToEmail";
export * from "./useCases/VerifyOtp";
