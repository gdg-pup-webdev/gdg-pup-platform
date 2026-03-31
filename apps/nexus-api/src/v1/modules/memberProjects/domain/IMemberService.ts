export abstract class IMemberService {
  abstract memberExistsByGdgId(memberGdgId: string): Promise<boolean>;
}
