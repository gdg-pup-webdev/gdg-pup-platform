export abstract class IMemberCheckService {
  abstract isMember(email: string): Promise<boolean>;
}
