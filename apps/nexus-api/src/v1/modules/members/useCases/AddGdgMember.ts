import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember, GdgMemberInsertProps, GdgMemberProps } from "../domain/GdgMember";

export type AddGdgMemberInput =   Omit<GdgMemberProps,  "gdgId" | "isPublic" | "avatarUrl">;;

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
    const member = GdgMember.create({ ...input, gdgId: id , avatarUrl: null, isPublic: true});

    // Save the GDG member
    return await this.repo.saveNew(member);
  }
}
