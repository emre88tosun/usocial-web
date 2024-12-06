import { useCallback } from 'react';
import { FetchInputType, FetchInitType } from '@customTypes/fetch';
import { Tokens } from '@customTypes/tokens';
import { TokensInfo } from '@contexts/auth/auth-context';

function useFetchBase() {
  return useCallback(
    async (
      input: FetchInputType,
      init?: FetchInitType,
      tokens?: Tokens & {
        setTokensInfo?: (tokensInfo: TokensInfo) => void;
      }
    ) => {
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (!(init?.body instanceof FormData)) {
        headers = {
          ...headers,
        };
      }

      if (tokens?.token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${tokens.token}`,
        };
      }
      if (tokens?.expires_at && tokens.expires_at * 1000 <= Date.now()) {
        const newTokensResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/auth/refresh-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${tokens.refresh_token}`,
            },
          }
        );
        const newTokens = await newTokensResponse.json();

        if (newTokens.token) {
          tokens?.setTokensInfo?.({
            token: newTokens.token,
            refresh_token: newTokens.refresh_token,
            chat_token: newTokens.chat_token,
            expires_at: newTokens.expires_at,
          });

          headers = {
            ...headers,
            Authorization: `Bearer ${newTokens.token}`,
          };
        } else {
          tokens?.setTokensInfo?.(null);
          throw new Error('Refresh token expired');
        }
      }

      return fetch(input, {
        ...init,
        headers: {
          ...headers,
          ...init?.headers,
        },
      });
    },
    []
  );
}

export default useFetchBase;
