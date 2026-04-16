import { StudyJamContainer } from "../StudyJamContainer";

export const TEAM_SECTION_CARD_CLASSNAME =
  "w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[340px]";

export function StudyJamCardsLoading({ count = 3 }: { count?: number }) {
  return Array.from({ length: count }, (_, index) => (
    <StudyJamContainer
      key={`study-jam-loading-${index}`}
      className={TEAM_SECTION_CARD_CLASSNAME}
    />
  ));
}
