 import { memberRepositoryInstance } from "./member.repository.js";

export class MemberService {
  constructor() {}

  /**
   * Checks if an email exists in the gdg_members table and returns the member details.
   * Returns null if not found.
   */
  async checkMemberByEmail(email: string) {
    const trimmedEmail = email.trim();
    return await memberRepositoryInstance.getMemberByEmail(trimmedEmail);
  }
}

export const memberService = new MemberService();
