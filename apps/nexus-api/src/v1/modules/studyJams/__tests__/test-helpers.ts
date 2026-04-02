import { StudyJam, StudyJamProps } from "../domain/StudyJam";

export const buildStudyJamProps = (
  overrides: Partial<StudyJamProps> = {},
): StudyJamProps => ({
  id: overrides.id ?? "studyjam-1",
  creatorId: overrides.creatorId ?? "user-1",
  title: overrides.title ?? "Study Jam: TypeScript",
  summary: overrides.summary ?? "Covers types, narrowing, and inference.",
  description:
    overrides.description ?? "Hands-on TypeScript session for beginners.",
  createdAt: overrides.createdAt ?? new Date("2026-01-01T00:00:00.000Z"),
});

export const buildStudyJam = (
  overrides: Partial<StudyJamProps> = {},
): StudyJam => StudyJam.hydrate(buildStudyJamProps(overrides));
