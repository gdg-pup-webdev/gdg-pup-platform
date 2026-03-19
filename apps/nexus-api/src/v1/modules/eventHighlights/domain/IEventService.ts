export abstract class IEventService {
  abstract exists(eventId: string): Promise<boolean>;
}
