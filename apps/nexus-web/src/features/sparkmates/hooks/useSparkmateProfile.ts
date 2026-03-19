import { useQuery } from "@tanstack/react-query";
import { getSparkmateByGdgId } from "../api/getSparkmateByGdgId";
import type { SparkmatesSource } from "../types";

export function useSparkmateProfile({
  gdgId,
  source,
}: {
  gdgId: string;
  source?: SparkmatesSource;
}) {
  return useQuery({
    queryKey: ["sparkmates-profile", gdgId, source],
    queryFn: () => getSparkmateByGdgId({ gdgId, source }),
    enabled: Boolean(gdgId),
  });
}
