import { useQuery } from "@tanstack/react-query";
import { getMemberProjectById } from "../api/getMemberProjectById";

export function useMemberProject(id: string) {
  return useQuery({
    queryKey: ["member-projects", "detail", id],
    queryFn: () => getMemberProjectById(id),
    enabled: !!id,
  });
}
