import { MemberShowcase } from "./MemberShowcase";

export interface MemberShowcaseFilters {
  search?: string;
  from?: Date | string;
  to?: Date | string;
}

export interface IMemberShowcaseRepository {
  findById(id: string): Promise<MemberShowcase | null>;
  findAll(pageNumber: number, pageSize: number, filters?: MemberShowcaseFilters): Promise<{ list: MemberShowcase[]; count: number }>;
  saveNew(memberShowcase: MemberShowcase): Promise<MemberShowcase>;
  persistUpdates(memberShowcase: MemberShowcase): Promise<MemberShowcase>;
  delete(id: string): Promise<void>;
  getSpotlightOfTheDay(): Promise<MemberShowcase | null>;
}
