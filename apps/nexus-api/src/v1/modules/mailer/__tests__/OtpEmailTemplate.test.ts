import { describe, it, expect } from "vitest";
import { OtpEmailTemplate } from "../templates/OtpEmailTemplate";

describe("OtpEmailTemplate", () => {
  it("should render the OTP code in the HTML", () => {
    const otp = "123456";
    const html = OtpEmailTemplate.render(otp);
    
    expect(html).toContain(otp);
    expect(html).toContain("Google Developers Group");
    expect(html).toContain("Verification Code");
  });

  it("should contain GDG branding colors", () => {
    const html = OtpEmailTemplate.render("123456");
    
    expect(html).toContain("#4285F4"); // Blue
    expect(html).toContain("#EA4335"); // Red
    expect(html).toContain("#FBBC05"); // Yellow
    expect(html).toContain("#34A853"); // Green
  });
});
