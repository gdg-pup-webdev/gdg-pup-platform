import { useQuery } from '@tanstack/react-query';
import { getCurrentUserGdgId } from '../api';

export function useCurrentGdgId(userId?: string) {
  return useQuery({
    queryKey: ['user-gdg-id', userId],
    queryFn: () => getCurrentUserGdgId(userId as string),
    enabled: !!userId,
  });
}
