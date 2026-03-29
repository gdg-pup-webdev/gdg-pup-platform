import { SendMailClient } from "zeptomail";
import { IMailerService } from "../domain/IMailerService";
import { Email } from "../domain/Email";
import { configs } from "@/configs/configs";

export class ZeptoMailerService implements IMailerService {
  private client: SendMailClient;

  constructor() {
    this.client = new SendMailClient({
      url: configs.zeptoMail.url,
      token: configs.zeptoMail.token,
    });
  }

  async send(email: Email): Promise<void> {
    const { to, subject, message } = email.props;

    // Only send if token is present, otherwise log it (to prevent breaking dev)
    if (!configs.zeptoMail.token) {
      console.warn("⚠️ [ZeptoMailerService] No ZEPTOMAIL_TOKEN found. Email not sent.");
      console.log(`To: ${to}\nSubject: ${subject}\nMessage: ${message}`);
      return;
    }

    try {
      await this.client.sendMail({
        from: {
          address: configs.zeptoMail.from.address,
          name: configs.zeptoMail.from.name,
        },
        to: [
          {
            email_address: {
              address: to,
              name: to.split("@")[0],
            },
          },
        ],
        subject: subject,
        htmlbody: message,
      });
    } catch (error) {
      console.error("❌ [ZeptoMailerService] Error sending email:", error);
      throw new Error("Failed to send email via ZeptoMail.");
    }
  }
}
