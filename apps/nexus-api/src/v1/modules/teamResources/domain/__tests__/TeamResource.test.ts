import { describe, expect, it } from "vitest";
import { TeamResource } from "../TeamResource";

describe("TeamResource Domain Entity", () => {
  const validProps = {
    title: "Testing Clean Architecture",
    description: "A deep dive into clean architecture in Node.js",
    resourceLink: "https://example.com/clean-arch",
    resourceType: "article",
    thumbnailStorageReference: "storage-ref-123",
    thumbnailPublicUrl: "https://example.com/image.png",
    teamName: "Nexus Web",
  };

  it("should create a new team resource with default values", () => {
    const resource = TeamResource.create(validProps);
    
    expect(resource.props.id).toBeDefined();
    expect(resource.props.title).toBe(validProps.title);
    expect(resource.props.thumbnailStorageReference).toBe(validProps.thumbnailStorageReference);
    expect(resource.props.createdAt).toBeInstanceOf(Date);
    expect(resource.props.updatedAt).toBeInstanceOf(Date);
  });

  it("should hydrate an existing team resource", () => {
    const fixedId = crypto.randomUUID();
    const fixedDate = new Date();
    const props = {
      ...validProps,
      id: fixedId,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };
    
    const resource = TeamResource.hydrate(props);
    
    expect(resource.props.id).toBe(fixedId);
    expect(resource.props.thumbnailPublicUrl).toBe(validProps.thumbnailPublicUrl);
  });

  it("should update team resource properties and refresh updatedAt", async () => {
    const resource = TeamResource.create(validProps);
    const initialUpdatedAt = resource.props.updatedAt.getTime();
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    resource.update({ title: "Updated Title", thumbnailPublicUrl: "https://newurl.com" });
    
    expect(resource.props.title).toBe("Updated Title");
    expect(resource.props.thumbnailPublicUrl).toBe("https://newurl.com");
    expect(resource.props.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt);
  });
});
