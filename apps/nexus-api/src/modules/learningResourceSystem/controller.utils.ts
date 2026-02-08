 import { tryCatch, tryCatch_deprecated } from "@/utils/tryCatch.util.js";

export const normalizeOptionalText = (value?: string): string | undefined => {
  const normalizedValue = value?.trim();
  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : undefined;
};

export const buildPaginationMeta = (
  totalRecords: number,
  pageNumber: number,
  pageSize: number,
) => ({
  totalRecords,
  currentPage: pageNumber,
  pageSize,
  totalPages: Math.ceil(totalRecords / pageSize),
});

export const runServiceCall = async <T>(
  operation: () => Promise<T>,
  context: string,
): Promise<T> => {
  const { data, error } = await tryCatch_deprecated(operation, context);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
