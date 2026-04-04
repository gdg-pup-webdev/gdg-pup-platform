import { useQuery } from "@tanstack/react-query";
import { useGetLearningResourceByIdRequest } from "./getLearningResourceById";

export function useGetLearningResource(id: string) {
  const getLearningResourceById = useGetLearningResourceByIdRequest();




  return useQuery({
    queryKey: ["learning-resources", id],
    queryFn: () => getLearningResourceById(id),
    enabled: !!id,
  });
}
