import { useQuery } from "@tanstack/react-query";
import { getSpotlight } from "../api/getSpotlight";

export function useSpotlight() {
  return useQuery({
    queryKey: ["member-showcase", "spotlight"],
    queryFn: getSpotlight,
  });
}
