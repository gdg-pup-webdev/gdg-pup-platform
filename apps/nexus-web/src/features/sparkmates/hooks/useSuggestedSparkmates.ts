import { useSuggestedMembers } from "./useSuggestedMembers";

export function useSuggestedSparkmates() {
  return useSuggestedMembers(1, 10);
}
