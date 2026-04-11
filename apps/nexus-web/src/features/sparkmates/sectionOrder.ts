export const SPARKMATES_SECTION_IDS = [
  "customButtons",
  "skillsAndInterests",
  "projects",
  "gdgImpact",
  "badges",
] as const;

export type SparkmatesSectionId = (typeof SPARKMATES_SECTION_IDS)[number];

export const DEFAULT_SPARKMATES_SECTION_ORDER: SparkmatesSectionId[] = [
  ...SPARKMATES_SECTION_IDS,
];

export function normalizeSparkmatesSectionOrder(
  sectionOrder: string[] | null | undefined,
): SparkmatesSectionId[] {
  if (!Array.isArray(sectionOrder)) {
    return [...DEFAULT_SPARKMATES_SECTION_ORDER];
  }

  const allowed = new Set<SparkmatesSectionId>(SPARKMATES_SECTION_IDS);
  const incoming = sectionOrder.filter(
    (item): item is SparkmatesSectionId =>
      typeof item === "string" && allowed.has(item as SparkmatesSectionId),
  );

  const deduped = Array.from(new Set(incoming));
  const missing = DEFAULT_SPARKMATES_SECTION_ORDER.filter(
    (item) => !deduped.includes(item),
  );

  return [...deduped, ...missing];
}

export function moveSparkmatesSection(
  sectionOrder: SparkmatesSectionId[],
  fromIndex: number,
  toIndex: number,
): SparkmatesSectionId[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= sectionOrder.length ||
    toIndex >= sectionOrder.length ||
    fromIndex === toIndex
  ) {
    return sectionOrder;
  }

  const next = [...sectionOrder];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}
