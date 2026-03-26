import { IUserService } from "../domain/IUserService";
import { UserModuleController } from "../../UserModule_deprecated/UserModuleController";

export class UserServiceAdapter implements IUserService {
  constructor(private readonly userController: UserModuleController) {}

  async exists(userId: string): Promise<boolean> {
    try {
      const user = await this.userController.getUser(userId);
      return !!user;
    } catch (error) {
      return false;
    }
  }
}
