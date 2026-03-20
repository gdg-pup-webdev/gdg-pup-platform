export abstract class IUserService {
  abstract exists(userId: string): Promise<boolean>;
}
