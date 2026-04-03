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
    queryFn: async () => {

      const res = await getSparkmateByGdgId({ gdgId, source })
      return res;
    },
    enabled: Boolean(gdgId),
  });
}
