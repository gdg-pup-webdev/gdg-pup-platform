import { GdgMembersController } from "../../members";
import { IUserService } from "../domain/IUserService"; 

export class UserAdapter implements IUserService {
  constructor(private readonly userController: GdgMembersController) {}

  async exists(gdgId: string): Promise<boolean> {
    try {
      const user = await this.userController.findByGdgId(gdgId);
      return !!user;
    } catch (error) {
      return false;
    }
  }
}
