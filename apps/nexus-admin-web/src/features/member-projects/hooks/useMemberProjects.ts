import { useQuery } from "@tanstack/react-query";
import { getMemberProjects } from "../api/getMemberProjects";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useMemberProjects(pageNumber = 1, pageSize = 10) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-projects", "list", pageNumber, pageSize],
    queryFn: () => getMemberProjects(callEndpoint, pageNumber, pageSize),
  });
}
