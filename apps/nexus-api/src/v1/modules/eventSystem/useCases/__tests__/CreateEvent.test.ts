// src/modules/eventSystem/useCases/__tests__/CreateEvent.test.ts

import { describe, expect, it, beforeEach } from "vitest"; 
import { MockEventRepository } from "../../infrastructure/MockEventRepository";
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

  // Helper for generating standard valid input
  const validEventInput: EventPrototypeProps = {
    title: "React Fundamentals",
    description: "Learn the basics of React",
    category: "WebDev",
    venue: "Main Hall",
    start_date: new Date("2026-03-01T10:00:00Z"), // Using future dates for consistency
    end_date: new Date("2026-03-01T12:00:00Z"),
    attendance_points: 50,
  };

  it("should successfully create and return a new event", async () => {
    // 1. Act
    const result = await createEventUseCase.execute(validEventInput);

    // 2. Assert - Check that the returned object matches our input
    expect(result).toBeDefined();
    expect(result.props.title).toBe(validEventInput.title);
    expect(result.props.description).toBe(validEventInput.description);
    expect(result.props.category).toBe(validEventInput.category);
    expect(result.props.venue).toBe(validEventInput.venue);
    expect(result.props.attendance_points).toBe(validEventInput.attendance_points);
    expect(result.props.start_date).toEqual(validEventInput.start_date);
    expect(result.props.end_date).toEqual(validEventInput.end_date);
  });

  it("should correctly initialize domain-generated fields (id, timestamps, attendees_count)", async () => {
    // 1. Act
    const result = await createEventUseCase.execute(validEventInput);

    // 2. Assert - Verify the Domain Entity handled its responsibilities
    expect(result.props.id).toBeDefined();
    expect(typeof result.props.id).toBe("string");
    
    expect(result.props.createdAt).toBeDefined();
    expect(result.props.createdAt).toBeInstanceOf(Date);
    
    expect(result.props.updatedAt).toBeDefined();
    expect(result.props.updatedAt).toBeInstanceOf(Date);
    
    expect(result.props.attendees_count).toBe(0); // Brand new events must have 0 attendees
  });

  it("should successfully persist the created event in the repository", async () => {
    // 1. Arrange - Verify repository is empty
    expect(eventRepository.events.length).toBe(0);

    // 2. Act
    const result = await createEventUseCase.execute(validEventInput);

    // 3. Assert - Check the internal state of the repository
    expect(eventRepository.events.length).toBe(1);
    
    const savedEvent = eventRepository.events[0];
    expect(savedEvent.props.id).toBe(result.props.id);
    expect(savedEvent.props.title).toBe(validEventInput.title);
  });
});