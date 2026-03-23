import { describe, it, expect, beforeEach } from "vitest";
import { MockMailerService } from "../infrastructure/MockMailerService";
import { SendEmail } from "../useCases/SendEmail";
import { Email } from "../domain/Email";

describe("SendEmail Use Case", () => {
  let mockService: MockMailerService;
  let useCase: SendEmail;

  beforeEach(() => {
    mockService = new MockMailerService();
    useCase = new SendEmail(mockService);
  });

  it("should send an email with valid details", async () => {
    const input = {
      to: "recipient@example.com",
      subject: "Hello World",
      message: "This is a test message.",
    };

    await useCase.execute(input);

    expect(mockService.sentEmails.length).toBe(1);
    const sentEmail = mockService.sentEmails[0];
    expect(sentEmail.props.to).toBe(input.to);
    expect(sentEmail.props.subject).toBe(input.subject);
    expect(sentEmail.props.message).toBe(input.message);
    expect(sentEmail.props.sentAt).toBeDefined();
  });

  it("should throw an error for invalid email address", async () => {
    const input = {
      to: "invalid-email",
      subject: "Test",
      message: "Test message",
    };

    await expect(useCase.execute(input)).rejects.toThrow("Invalid receiver email address.");
  });

  it("should throw an error for empty subject", async () => {
    const input = {
      to: "valid@email.com",
      subject: "",
      message: "Test message",
    };

    await expect(useCase.execute(input)).rejects.toThrow("Subject is required.");
  });

  it("should throw an error for empty message", async () => {
    const input = {
      to: "valid@email.com",
      subject: "Test",
      message: "",
    };

    await expect(useCase.execute(input)).rejects.toThrow("Message is required.");
  });
});
