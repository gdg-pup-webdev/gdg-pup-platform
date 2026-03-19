import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateHighlight } from "../useCases/CreateHighlight";
import { MockEventHighlightRepository } from "../infrastructure/MockEventHighlightRepository";
import { MockUserService } from "../infrastructure/MockUserService";
import { MockEventService } from "../infrastructure/MockEventService";

describe("CreateHighlight Use Case", () => {
  let repo: MockEventHighlightRepository;
  let userService: MockUserService;
  let eventService: MockEventService;
  let useCase: CreateHighlight;

  beforeEach(() => {
    repo = new MockEventHighlightRepository();
    userService = new MockUserService();
    eventService = new MockEventService();
    useCase = new CreateHighlight(repo, userService, eventService);
  });

  it("should create a highlight successfully", async () => {
    userService.existingUserIds.push("user-1");
    eventService.existingEventIds.push("event-1");

    const props = {
      title: "Test Highlight",
      description: "Test Description",
      content: "Test Content",
      authorId: "user-1",
      eventId: "event-1",
    };

    const result = await useCase.execute(props);

    expect(result.props.title).toBe(props.title);
    expect(repo.items.length).toBe(1);
  });

  it("should throw error if author does not exist", async () => {
    userService.existingUserIds = [];
    eventService.existingEventIds.push("event-1");

    const props = {
      title: "Test Highlight",
      description: "Test Description",
      content: "Test Content",
      authorId: "invalid-user",
      eventId: "event-1",
    };

    await expect(useCase.execute(props)).rejects.toThrow("Author does not exist");
  });

  it("should throw error if event does not exist", async () => {
    userService.existingUserIds.push("user-1");
    eventService.existingEventIds = [];

    const props = {
      title: "Test Highlight",
      description: "Test Description",
      content: "Test Content",
      authorId: "user-1",
      eventId: "invalid-event",
    };

    await expect(useCase.execute(props)).rejects.toThrow("Event does not exist");
  });
});
