import { describe, expect, it, beforeEach } from "vitest";
import { MockEventRepository } from "../../infrastructure/mocks/MockEventRepository";
import { EventPrototypeProps } from "../../domain/Event";
import { CreateEvent } from "../CreateEvent";

let eventRepository: MockEventRepository;
let createEventUseCase: CreateEvent;

const initializeInstances = () => {
  eventRepository = new MockEventRepository();
  createEventUseCase = new CreateEvent(eventRepository);
};

describe("CreateEvent Use Case", () => {
  beforeEach(initializeInstances);

  const validEventInput: EventPrototypeProps = {
    title: "React Fundamentals",
    description: "Learn the basics of React",
    category: "WebDev",
    venue: "Main Hall",
    start_date: new Date("2026-03-01T10:00:00Z"),
    end_date: new Date("2026-03-01T12:00:00Z"),
    attendance_points: 50,
    bevy_event_id: null,
    creatorId: "user-123",
    image_url: "https://example.com/image.png",
  };

  it("should successfully create and return a new event", async () => {
    const result = await createEventUseCase.execute(validEventInput);

    expect(result).toBeDefined();
    expect(result.props.title).toBe(validEventInput.title);
    expect(result.props.description).toBe(validEventInput.description);
    expect(result.props.creatorId).toBe(validEventInput.creatorId);
    expect(result.props.image_url).toBe(validEventInput.image_url);
  });

  it("should correctly initialize domain-generated fields (id, timestamps, attendees_count)", async () => {
    const result = await createEventUseCase.execute(validEventInput);

    expect(result.props.id).toBeDefined();
    expect(result.props.createdAt).toBeInstanceOf(Date);
    expect(result.props.attendees_count).toBe(0);
  });

  it("should successfully persist the created event in the repository", async () => {
    const result = await createEventUseCase.execute(validEventInput);
    expect(eventRepository.events.length).toBe(1);
    expect(eventRepository.events[0].props.id).toBe(result.props.id);
  });
});
