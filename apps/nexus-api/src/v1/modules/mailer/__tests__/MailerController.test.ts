import { describe, it, expect, beforeEach } from "vitest";
import { MockMailerService } from "../infrastructure/MockMailerService";
import { SendEmail } from "../useCases/SendEmail";
import { MailerController } from "../MailerController";

describe("MailerController", () => {
  let mockService: MockMailerService;
  let useCase: SendEmail;
  let controller: MailerController;

  beforeEach(() => {
    mockService = new MockMailerService();
    useCase = new SendEmail(mockService);
    controller = new MailerController(useCase);
  });

  it("should successfully send an email through the controller", async () => {
    const result = await controller.sendEmail("test@example.com", "Test Subject", "Test Message");

    expect(result).toEqual({ success: true, message: "Email sent successfully" });
    expect(mockService.sentEmails.length).toBe(1);
    expect(mockService.sentEmails[0].props.to).toBe("test@example.com");
  });
});
