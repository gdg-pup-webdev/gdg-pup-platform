import { describe, it, expect } from "vitest";
import { OtpEmailTemplate } from "../templates/OtpEmailTemplate";

describe("OtpEmailTemplate", () => {
  it("should render the OTP code in the HTML", () => {
    const otp = "123456";
    const html = OtpEmailTemplate.render(otp);
    
    expect(html).toContain(otp);
    expect(html).toContain("Google Developer Groups");
    expect(html).toContain("Verification Code");
  });

  it("should render with custom context", () => {
    const otp = "123456";
    const context = "Forgot Password";
    const html = OtpEmailTemplate.render(otp, context);
    
    expect(html).toContain(otp);
    expect(html).toContain(context);
    expect(html).toContain("forgot password"); // lowercase version in message
  });

  it("should contain GDG branding colors", () => {
    const html = OtpEmailTemplate.render("123456");
    
    expect(html).toContain("#4285F4"); // Blue
    expect(html).toContain("#EA4335"); // Red
    expect(html).toContain("#FBBC04"); // Yellow
    expect(html).toContain("#34A853"); // Green
  });
});
