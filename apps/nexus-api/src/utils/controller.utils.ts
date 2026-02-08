
export const normalizeOptionalText = (value?: string): string | undefined => {
  const normalizedValue = value?.trim();
  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : undefined;
};

export const buildPaginationMeta = (
  totalRecords: number,
  pageNumber: number,
  pageSize: number
) => ({
  totalRecords,
  currentPage: pageNumber,
  pageSize,
  totalPages: Math.ceil(totalRecords / pageSize),
});
