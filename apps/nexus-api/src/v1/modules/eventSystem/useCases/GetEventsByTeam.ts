import { Event } from "../domain/Event";
import { IEventRepository } from "../domain/IEventRepository";

export class GetEventsByTeam {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(teamId: string, pageNumber: number, pageSize: number): Promise<{ list: Event[]; count: number }> {
    return await this.eventRepository.findByTeamId(teamId, pageNumber, pageSize);
  }
}
