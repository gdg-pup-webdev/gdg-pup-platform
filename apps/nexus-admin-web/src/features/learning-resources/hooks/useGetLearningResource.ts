import { useQuery } from "@tanstack/react-query";
import { getLearningResourceById } from "../api/getLearningResourceById";

export function useGetLearningResource(id: string) {
  return useQuery({
    queryKey: ["learning-resources", id],
    queryFn: () => getLearningResourceById(id),
    enabled: !!id,
  });
}
