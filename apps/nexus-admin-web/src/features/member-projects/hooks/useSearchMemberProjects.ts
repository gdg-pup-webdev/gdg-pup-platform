import { useQuery } from "@tanstack/react-query";
import { searchMemberProjects } from "../api/searchMemberProjects";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useSearchMemberProjects(query: string, pageNumber = 1, pageSize = 10) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-projects", "search", query, pageNumber, pageSize],
    queryFn: () => searchMemberProjects(callEndpoint, query, pageNumber, pageSize),
    enabled: !!query,
  });
}
