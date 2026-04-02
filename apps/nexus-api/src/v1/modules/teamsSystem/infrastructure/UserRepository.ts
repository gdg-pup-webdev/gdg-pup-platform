import { gdgMembersController } from "../../members";
import { IUserRepository } from "../domain/IUserRepository";
import { User } from "../domain/User";

export class UserRepository implements IUserRepository {
  async findById(userId: string) {
    const data = await gdgMembersController.findByGdgId(userId);
    if (!data) return null;

    const user = User.hydrate({
      gdgId: data.gdgId,
      memberName: data.firstName + " " + data.lastName,
      thumbnailImageUrl: data.avatarUrl,
    });
    return user;
  }
}
