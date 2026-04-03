import { Email } from "../domain/Email";
import { IMailerService } from "../domain/IMailerService";

export interface SendEmailInput {
  to: string;
  subject: string;
  message: string;
}

export class SendEmail {
  constructor(private readonly mailerService: IMailerService) {}

  async execute(input: SendEmailInput): Promise<void> {
    const email = Email.create({
      to: input.to,
      subject: input.subject,
      message: input.message,
    });

    await this.mailerService.send(email);
    email.markAsSent();
  }
}
