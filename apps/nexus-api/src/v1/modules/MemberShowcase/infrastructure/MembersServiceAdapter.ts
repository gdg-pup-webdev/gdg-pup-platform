import { IMembersService } from "../domain/IMembersService";
import { GdgMembersController } from "../../members/GdgMembersController";

export class MembersServiceAdapter implements IMembersService {
  constructor(private readonly membersController: GdgMembersController) {}

  async findByIds(ids: string[]): Promise<any[]> {
    const results = [];
    for (const id of ids) {
      try {
        const member = await this.membersController.findByGdgId(id);
        if (member) results.push(member);
      } catch (error) {
        // Silently skip or log? In clean arch, let's just skip non-existent members or those that cause error
      }
    }
    return results;
  }

  async exists(id: string): Promise<boolean> {
    try {
      const member = await this.membersController.findByGdgId(id);
      return !!member;
    } catch (error) {
      return false;
    }
  }
}
