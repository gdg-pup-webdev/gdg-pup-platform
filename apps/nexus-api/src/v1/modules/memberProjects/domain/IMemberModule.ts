export abstract class IMemberModule {
  abstract memberExistsByGdgId(memberGdgId: string): Promise<boolean>;
}
