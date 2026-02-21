import { Event, EventPrototypeProps } from "../domain/Event";
import { IAttendanceRepository } from "../domain/IAttendanceRepository";
import { IEventRepository } from "../domain/IEventRepository";

export class CheckinToEvent {
  constructor(private eventRepository: IEventRepository, private attendanceRepository : IAttendanceRepository) {}

  async execute(eventId: string, userId: string, checkInMethod: string): Promise<Event> {
    /**
     * STEPS: 
     * - load event 
     * - create new attendance object
     * - call points repository to update user points 
     * - add attendance to the event 
     * - persist new attendance 
     * - persist updates to the event 
     * - return attendance, new user wallet
     */
 
    const currentEvent = await this.eventRepository.findById(eventId);
    const newAttendance = currentEvent.addAttendance(userId, checkInMethod);

    await this.attendanceRepository.persistNewAttendance(newAttendance);

    
  }
}
