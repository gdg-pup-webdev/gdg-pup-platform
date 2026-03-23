import { MockMailerService } from "./infrastructure/MockMailerService";
import { SendEmail } from "./useCases/SendEmail";
import { MailerController } from "./MailerController";

const mailerService = new MockMailerService();
const sendEmailUseCase = new SendEmail(mailerService);

export const mailerController = new MailerController(sendEmailUseCase);

export { MailerController };
export * from "./domain/Email";
export * from "./domain/IMailerService";
export * from "./useCases/SendEmail";
