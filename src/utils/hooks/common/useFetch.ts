import { useCallback } from 'react';
import { FetchInitType, FetchInputType } from '@customTypes/fetch';
import useAuthTokens from '@hooks/auth/useAuthTokens';
import useFetchBase from '@hooks/common/useFetchBase';

function useFetch() {
  const { tokensInfoRef, setTokensInfo } = useAuthTokens();
  const fetchBase = useFetchBase();

  const fetchWrapper = useCallback(
    async (input: FetchInputType, init?: FetchInitType) => {
      return fetchBase(input, init, {
        token: tokensInfoRef.current?.token,
        refresh_token: tokensInfoRef.current?.refresh_token,
        chat_token: tokensInfoRef.current?.chat_token,
        expires_at: tokensInfoRef.current?.expires_at,
        setTokensInfo,
      });
    },
    [fetchBase, setTokensInfo, tokensInfoRef]
  );

  return fetchWrapper;
}

export default useFetch;
