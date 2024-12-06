import { useContext } from 'react';
import { AuthActionsContext } from '@contexts/auth/auth-context';

function useAuthActions() {
  return useContext(AuthActionsContext);
}

export default useAuthActions;
