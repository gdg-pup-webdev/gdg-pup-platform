
import { useAuthContext } from '@/features/authentication/store/useAuthStore';

/**
 * @deprecated use `useAuthContext` directly to get the current user's GDG ID instead. This function is a simple wrapper around `useAuthContext` and does not provide any additional functionality.
 */
export async function getCurrentUserGdgId( ): Promise<string | null> {

  const { decodedToken } = useAuthContext();

  if (!decodedToken) {
    return null;
  }

  return decodedToken.memberInfo.gdgId
 
}
