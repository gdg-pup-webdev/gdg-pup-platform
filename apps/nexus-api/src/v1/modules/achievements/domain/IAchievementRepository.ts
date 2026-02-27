import { Achievement } from "./Achievement";

export interface IAchievementRepository {
  findById(id: string): Promise<Achievement | null>;
  findAll(
    filters?: { userId?: string },
    page?: number,
    size?: number,
  ): Promise<{ list: Achievement[]; count: number }>;
  saveNew(achievement: Achievement): Promise<Achievement>;
  persistUpdates(achievement: Achievement): Promise<Achievement>; // <-- Updated Signature
  delete(id: string): Promise<void>;
}
