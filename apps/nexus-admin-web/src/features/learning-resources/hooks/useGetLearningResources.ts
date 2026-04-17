import { useQuery } from "@tanstack/react-query";
import { getLearningResources } from "../api/getLearningResources";
import { LearningResourcesQueryParams } from "../types";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useGetLearningResources(params: Partial<LearningResourcesQueryParams> = {}) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["learning-resources", params],
    queryFn: () => getLearningResources(callEndpoint, params),
  });
}
