import { useQuery } from "@tanstack/react-query";
import { getLearningResourceById } from "../api/getLearningResourceById";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useGetLearningResource(id: string) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["learning-resources", id],
    queryFn: () => getLearningResourceById(callEndpoint, id),
    enabled: !!id,
  });
}
