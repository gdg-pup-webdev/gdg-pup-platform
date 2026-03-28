import { describe, expect, it } from "vitest";
import { LearningResource } from "../LearningResource";

describe("LearningResource Domain Entity", () => {
  const validProps = {
    title: "Testing Clean Architecture",
    description: "A deep dive into clean architecture in Node.js",
    url: "https://example.com/clean-arch",
    tags: ["clean-architecture", "nodejs"],
    teamId: "team-123",
    eventId: null,
    thumbnailUrl: "https://example.com/image.png",
  };

  it("should create a new learning resource with default values", () => {
    const resource = LearningResource.create(validProps);
    
    expect(resource.props.id).toBeDefined();
    expect(resource.props.title).toBe(validProps.title);
    expect(resource.props.thumbnailUrl).toBe(validProps.thumbnailUrl);
    expect(resource.props.createdAt).toBeInstanceOf(Date);
    expect(resource.props.updatedAt).toBeInstanceOf(Date);
  });

  it("should hydrate an existing learning resource", () => {
    const fixedId = crypto.randomUUID();
    const fixedDate = new Date();
    const props = {
      ...validProps,
      id: fixedId,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };
    
    const resource = LearningResource.hydrate(props);
    
    expect(resource.props.id).toBe(fixedId);
    expect(resource.props.thumbnailUrl).toBe(validProps.thumbnailUrl);
  });

  it("should update learning resource properties and refresh updatedAt", async () => {
    const resource = LearningResource.create(validProps);
    const initialUpdatedAt = resource.props.updatedAt.getTime();
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    resource.update({ title: "Updated Title", thumbnailUrl: "https://newurl.com" });
    
    expect(resource.props.title).toBe("Updated Title");
    expect(resource.props.thumbnailUrl).toBe("https://newurl.com");
    expect(resource.props.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt);
  });
});
