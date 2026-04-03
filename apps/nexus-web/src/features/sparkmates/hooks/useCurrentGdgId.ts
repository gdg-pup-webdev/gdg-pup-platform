import { useQuery } from '@tanstack/react-query';
import { getCurrentUserGdgId } from '../api';

/**
 * @deprecated
 */
export function useCurrentGdgId(userId?: string) {
  return getCurrentUserGdgId( );
}
