"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QueryValue = string | number | boolean | null | undefined;

interface SetQueryOptions {
  method?: "replace" | "push";
  scroll?: boolean;
}

export function useAdminQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQueryParams = useCallback(
    (updates: Record<string, QueryValue>, options?: SetQueryOptions) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          nextParams.delete(key);
          return;
        }

        nextParams.set(key, String(value));
      });

      const query = nextParams.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      const scroll = options?.scroll ?? false;

      if (options?.method === "push") {
        router.push(href, { scroll });
        return;
      }

      router.replace(href, { scroll });
    },
    [pathname, router, searchParams],
  );

  const getString = useCallback(
    (key: string, fallback = "") => {
      const value = searchParams.get(key);
      return value ?? fallback;
    },
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const value = searchParams.get(key);
      if (!value) {
        return fallback;
      }

      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 1) {
        return fallback;
      }

      return parsed;
    },
    [searchParams],
  );

  const getBoolean = useCallback(
    (key: string, fallback = false) => {
      const value = searchParams.get(key);
      if (!value) {
        return fallback;
      }

      return value === "1" || value.toLowerCase() === "true";
    },
    [searchParams],
  );

  return {
    searchParams,
    setQueryParams,
    getString,
    getNumber,
    getBoolean,
  };
}
