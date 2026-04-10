import { useQuery } from "@tanstack/react-query";
import { getMemberProjects } from "../api/memberProjects";

export function usePublicMemberProjects(gdgId?: string) {
  return useQuery({
    queryKey: ["publicMemberProjects", gdgId],
    queryFn: () => {
      if (!gdgId) throw new Error("No GDG ID provided");
      return getMemberProjects(gdgId);
    },
    enabled: Boolean(gdgId),
  });
}
