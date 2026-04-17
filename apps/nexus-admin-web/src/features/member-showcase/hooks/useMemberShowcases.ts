import { useQuery } from "@tanstack/react-query";
import { getMemberShowcases } from "../api/getMemberShowcases";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useMemberShowcases(pageNumber = 1, pageSize = 10) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-showcases", pageNumber, pageSize],
    queryFn: () => getMemberShowcases(callEndpoint, pageNumber, pageSize),
  });
}
