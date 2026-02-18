import { BadRequestError } from "@/errors/HttpError.js";
import { memberRepositoryInstance } from "./member.repository.js";

export class MemberService {
  constructor() {}

  /**
   * Checks if an email exists in the gdg_members table.
   * Throws a BadRequestError if the email is not found or if there is an error.
   */
  async ensureEmailIsMember(email: string): Promise<boolean> {
    const member = await memberRepositoryInstance.getMemberByEmail(email);

    if (!member) {
      throw new BadRequestError(
        "Access denied: Email is not a registered GDG member.",
      );
    }

    return true;
  }
}

export const memberService = new MemberService();
