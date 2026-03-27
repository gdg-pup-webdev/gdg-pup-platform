import { IGdgMemberService } from "../../domain/IAuthenticationInterfaces.js";
import { MemberInfo } from "../../domain/TokenPayload.js";


export class MockGdgMemberService implements IGdgMemberService {
  // We remove the constructor dependency on the real controller entirely.

  async getMemberInfoByEmail(email: string): Promise<MemberInfo> {
    // Simulate a "not found" scenario for a specific test email
    if (email === "notfound@example.com") {
      throw new Error("Member not found");
    }

    // Return a predictable mock member for all other emails
    return {
      gdgId: "mock-gdg-12345",
      firstName: "Jane",
      middleName: "A",
      lastName: "Doe",
      suffix: "",
    };
  }
}