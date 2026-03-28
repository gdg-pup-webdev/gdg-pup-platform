import { useQuery } from "@tanstack/react-query";
import { getMemberShowcaseById } from "../api/getMemberShowcaseById";

export function useMemberShowcase(id: string) {
  return useQuery({
    queryKey: ["member-showcase", id],
    queryFn: () => getMemberShowcaseById(id),
    enabled: !!id,
  });
}
