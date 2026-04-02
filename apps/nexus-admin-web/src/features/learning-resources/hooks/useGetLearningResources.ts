import { useQuery } from "@tanstack/react-query";
import { getLearningResources } from "../api/getLearningResources";
import { LearningResourcesQueryParams } from "../types";

export function useGetLearningResources(params: Partial<LearningResourcesQueryParams> = {}) {
  return useQuery({
    queryKey: ["learning-resources", params],
    queryFn: () => getLearningResources(params),
  });
}
