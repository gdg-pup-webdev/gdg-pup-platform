import { gdgMembersController } from "../../members";
import { IMemberService } from "../domain/IMemberService";

export class MemberAdapter implements IMemberService {
    constructor () {}

    async memberExistsByGdgId(memberGdgId: string): Promise<boolean> {
        const res = await gdgMembersController.findByGdgId(memberGdgId);
        return !!res;
    }
}