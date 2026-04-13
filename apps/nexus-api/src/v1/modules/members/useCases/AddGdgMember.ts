import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import {
  GdgMember,
  GdgMemberInsertProps,
  GdgMemberProps,
  SparkmatesSectionId,
} from "../domain/GdgMember";

const DEFAULT_SPARKMATES_SECTION_ORDER: SparkmatesSectionId[] = [
  "customButtons",
  "skillsAndInterests",
  "projects",
  "gdgImpact",
  "badges",
];

export type AddGdgMemberInput = Omit<
  GdgMemberProps,
  | "gdgId"
  | "isPublic"
  | "avatarUrl"
  | "avatarUrl64"
  | "avatarUrl512"
  | "sectionOrder"
>;

export class AddGdgMember {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(input: AddGdgMemberInput): Promise<GdgMember> {
    // Generate a unique ID
    const yearPrefix = new Date().getFullYear().toString().slice(-2);
    const highestNumber = await this.repo.getHighestIdNumberForYear(yearPrefix);
    const nextNumber = highestNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(6, "0");
    const id = `GDGPUP-${yearPrefix}-${paddedNumber}`;

    // Create the GDG member
    const member = GdgMember.create({
      ...input,
      gdgId: id,
      avatarUrl: null,
      avatarUrl64: null,
      avatarUrl512: null,
      isPublic: true,
      sectionOrder: DEFAULT_SPARKMATES_SECTION_ORDER,
    });

    // Save the GDG member
    return await this.repo.saveNew(member);
  }
}
