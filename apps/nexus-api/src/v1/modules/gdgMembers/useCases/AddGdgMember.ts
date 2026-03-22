import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember, GdgMemberProps } from "../domain/GdgMember";

export type AddGdgMemberInput = Omit<GdgMemberProps, "id">;

export class AddGdgMember {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(input: AddGdgMemberInput): Promise<GdgMember> {
    const yearPrefix = new Date().getFullYear().toString().slice(-2);
    const highestNumber = await this.repo.getHighestIdNumberForYear(yearPrefix);
    const nextNumber = highestNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(6, "0");
    const id = `GDGPUP-${yearPrefix}-${paddedNumber}`;

    const member = GdgMember.create({ ...input, id });
    return await this.repo.saveNew(member);
  }
}
