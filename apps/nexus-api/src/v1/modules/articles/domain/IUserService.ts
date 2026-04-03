export abstract class IUserService {
  abstract exists(gdgId: string): Promise<boolean>;
}
