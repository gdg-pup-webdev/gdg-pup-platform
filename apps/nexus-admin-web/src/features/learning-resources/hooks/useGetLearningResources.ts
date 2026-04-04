import { useQuery } from "@tanstack/react-query";
import { useGetLearningResourcesRequest } from "./getLearningResources";
import { LearningResourcesQueryParams } from "../types";

export function useGetLearningResources(params: Partial<LearningResourcesQueryParams> = {}) {
  const getLearningResources = useGetLearningResourcesRequest();
  return useQuery({
    queryKey: ["learning-resources", params],
    queryFn: () => getLearningResources(params),
  });
}
