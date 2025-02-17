import { useContext } from 'react';
import { AuthTokensContext } from '@contexts/auth/auth-context';

function useAuthTokens() {
  return useContext(AuthTokensContext);
}

export default useAuthTokens;
