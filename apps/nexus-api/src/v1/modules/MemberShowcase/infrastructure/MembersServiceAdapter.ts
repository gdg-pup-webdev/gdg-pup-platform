import { IMembersService, ShowcasedMember } from "../domain/IMembersService";
import { GdgMembersController } from "../../members/GdgMembersController";

export class MembersServiceAdapter implements IMembersService {
  constructor(private readonly membersController: GdgMembersController) {}

  async findByIds(ids: string[]): Promise<ShowcasedMember[]> {
    const results: ShowcasedMember[] = [];
    for (const id of ids) {
      try {
        const member = await this.membersController.findByGdgId(id);
        if (member) {
          results.push({
            gdgId: member.gdgId,
            displayName: member.displayName,
            firstName: member.firstName,
            lastName: member.lastName,
            avatarUrl: member.avatarUrl,
            program: member.program,
            yearLevel: member.yearLevel
          });
        }
      } catch (error) {
        // Skip members that cause errors
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
