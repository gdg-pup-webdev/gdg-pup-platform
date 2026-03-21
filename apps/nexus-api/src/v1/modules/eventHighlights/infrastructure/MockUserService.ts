import { IUserService } from "../domain/IUserService";

export class MockUserService implements IUserService {
  public existingUserIds: string[] = [];

  async exists(userId: string): Promise<boolean> {
    return this.existingUserIds.includes(userId);
  }
}
