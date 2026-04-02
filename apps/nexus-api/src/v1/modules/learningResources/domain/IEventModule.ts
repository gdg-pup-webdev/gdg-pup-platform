export abstract class IEventModule {
  abstract existsById(id: string): Promise<boolean>;
}
