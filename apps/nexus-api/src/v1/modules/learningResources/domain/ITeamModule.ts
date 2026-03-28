export abstract class ITeamModule {
  abstract existsById(id: string): Promise<boolean>;
}
