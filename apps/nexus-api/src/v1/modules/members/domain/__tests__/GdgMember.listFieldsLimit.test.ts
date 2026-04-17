import { describe, expect, it } from "vitest";
import {
  GdgMember,
  GdgMemberInsertProps,
  GDG_MEMBER_LIST_FIELD_MAX_ITEMS,
} from "../GdgMember";
import { ValidationError } from "@/v1/errors/HttpError";

const makeItems = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => `item-${index + 1}`);

const createBaseProps = (): GdgMemberInsertProps => ({
  gdgId: "GDGPUP-26-000001",
  email: "member@example.com",
  membershipType: null,
  avatarUrl: null,
  avatarUrl64: null,
  avatarUrl512: null,
  program: null,
  yearLevel: null,
  department: null,
  displayName: null,
  firstName: "John",
  middleName: null,
  lastName: "Doe",
  suffix: null,
  bio: null,
  githubUrl: null,
  linkedinUrl: null,
  portfolioWebsiteUrl: null,
  otherLinks: [],
  technicalSkills: [],
  learningInterests: [],
  toolsAndTechnologies: [],
  sectionOrder: [
    "customButtons",
    "skillsAndInterests",
    "projects",
    "gdgImpact",
    "badges",
  ],
  isOnboarded: true,
  isPublic: true,
});

describe("GdgMember list field limits", () => {
  it("rejects create when otherLinks exceeds 20 items", () => {
    const props = createBaseProps();
    props.otherLinks = makeItems(GDG_MEMBER_LIST_FIELD_MAX_ITEMS + 1);

    expect(() => GdgMember.create(props)).toThrow(ValidationError);
  });

  it("rejects create when technicalSkills exceeds 20 items", () => {
    const props = createBaseProps();
    props.technicalSkills = makeItems(GDG_MEMBER_LIST_FIELD_MAX_ITEMS + 1);

    expect(() => GdgMember.create(props)).toThrow(ValidationError);
  });

  it("rejects create when learningInterests exceeds 20 items", () => {
    const props = createBaseProps();
    props.learningInterests = makeItems(GDG_MEMBER_LIST_FIELD_MAX_ITEMS + 1);

    expect(() => GdgMember.create(props)).toThrow(ValidationError);
  });

  it("rejects create when toolsAndTechnologies exceeds 20 items", () => {
    const props = createBaseProps();
    props.toolsAndTechnologies = makeItems(GDG_MEMBER_LIST_FIELD_MAX_ITEMS + 1);

    expect(() => GdgMember.create(props)).toThrow(ValidationError);
  });

  it("accepts create when list fields have exactly 20 items", () => {
    const props = createBaseProps();
    const listItems = makeItems(GDG_MEMBER_LIST_FIELD_MAX_ITEMS);

    props.otherLinks = listItems;
    props.technicalSkills = listItems;
    props.learningInterests = listItems;
    props.toolsAndTechnologies = listItems;

    expect(() => GdgMember.create(props)).not.toThrow();
  });

  it("rejects update when a list field exceeds 20 items", () => {
    const member = GdgMember.create(createBaseProps());

    expect(() =>
      member.update({
        technicalSkills: makeItems(GDG_MEMBER_LIST_FIELD_MAX_ITEMS + 1),
      }),
    ).toThrow(ValidationError);
  });
});
