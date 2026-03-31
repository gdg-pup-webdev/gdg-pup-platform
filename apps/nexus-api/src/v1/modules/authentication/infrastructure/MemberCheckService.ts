import { IMemberCheckService } from "../domain/IMemberCheckService.js";
import { GdgMembersController } from "../../members/GdgMembersController.js";

export class MemberCheckService implements IMemberCheckService {
  constructor(private readonly gdgMembersController: GdgMembersController) {}

  async isMember(email: string): Promise<boolean> {
    const member = await this.gdgMembersController.findByEmail(email);
    return !!member;
  }
}
