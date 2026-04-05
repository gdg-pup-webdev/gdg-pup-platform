
import { useAuthContext } from '@/features/authentication/store/useAuthStore';

export async function getCurrentUserGdgId( ): Promise<string | null> {

  const { decodedToken } = useAuthContext();

  if (!decodedToken) {
    return null;
  }

  return decodedToken.memberInfo.gdgId
 
}
