import { Email } from "../domain/Email";
import { IMailerService } from "../domain/IMailerService";

export class MockMailerService implements IMailerService {
  public sentEmails: Email[] = [];

  async send(email: Email): Promise<void> {
    const p = email.props;
    this.sentEmails.push(email);
    
    console.log("\n" + "=".repeat(50));
    console.log("📧 [MOCK EMAIL SENT]");
    console.log("-".repeat(50));
    console.log(`To:      ${p.to}`);
    console.log(`Subject: ${p.subject}`);
    console.log(`Message: ${p.message}`);
    console.log(`Sent At: ${new Date().toLocaleString()}`);
    console.log("=".repeat(50) + "\n");
  }
}
