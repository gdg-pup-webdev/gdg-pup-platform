import { MockMailerService } from "./infrastructure/MockMailerService";
import { ZeptoMailerService } from "./infrastructure/ZeptoMailerService";
import { SendEmail } from "./useCases/SendEmail";
import { MailerController } from "./MailerController";
import { configs } from "@/configs/configs";

const mailerService = configs.zeptoMail.token
  ? new ZeptoMailerService()
  : new MockMailerService();

const sendEmailUseCase = new SendEmail(mailerService);

export const mailerController = new MailerController(sendEmailUseCase);

export { MailerController };
export * from "./domain/Email";
export * from "./domain/IMailerService";
export * from "./useCases/SendEmail";
export * from "./templates/OtpEmailTemplate";
