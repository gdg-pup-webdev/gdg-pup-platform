import { useQuery } from "@tanstack/react-query";
import { useGetSpotlightRequest } from "./getSpotlight";

export function useSpotlight() {
  const getSpotlight = useGetSpotlightRequest();




  return useQuery({
    queryKey: ["member-showcase", "spotlight"],
    queryFn: getSpotlight,
  });
}
