import { SendEmail } from "./useCases/SendEmail";

export class MailerController {
  constructor(private readonly sendEmailUseCase: SendEmail) {}

  async sendEmail(to: string, subject: string, message: string) {
    await this.sendEmailUseCase.execute({ to, subject, message });
    return { success: true, message: "Email sent successfully" };
  }
}
