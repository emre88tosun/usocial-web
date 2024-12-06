'use client';

import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import useFetchBase from '@hooks/common/useFetchBase';
import HTTP_CODES_ENUM from '@constants/http';
import { Tokens } from '@customTypes/tokens';
import { User } from '@customTypes/user';
import {
  AuthActionsContext,
  AuthContext,
  AuthTokensContext,
  TokensInfo,
} from './auth-context';
import { useQueryClient } from '@tanstack/react-query';

function AuthProvider(props: PropsWithChildren<unknown>) {
  const queryClient = useQueryClient();
  const AUTH_TOKEN_KEY = 'auth-token-data';
  const [tabId] = useState(() => Math.random().toString(36).slice(2));
  const [broadcastChannel] = useState(
    () => new BroadcastChannel(AUTH_TOKEN_KEY)
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const tokensInfoRef = useRef<Tokens>({
    token: null,
    refresh_token: null,
    chat_token: null,
    expires_at: null,
  });
  const fetchBase = useFetchBase();

  const removeQueries = useCallback(() => {
    return queryClient.removeQueries();
  }, []);

  const setTokensInfoRef = useCallback((tokens: TokensInfo) => {
    tokensInfoRef.current = tokens ?? {
      token: null,
      refresh_token: null,
      chat_token: null,
      expires_at: null,
    };
  }, []);

  const setTokensInfo = useCallback(
    (tokensInfo: TokensInfo) => {
      setTokensInfoRef(tokensInfo);
      broadcastChannel.postMessage({
        tabId,
        tokens: tokensInfo,
      });

      if (tokensInfo) {
        Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(tokensInfo));
        loadData();
      } else {
        Cookies.remove(AUTH_TOKEN_KEY);
        setUser(null);
      }
    },
    [setTokensInfoRef, broadcastChannel, tabId]
  );

  const logOut = useCallback(async () => {
    const tokens = JSON.parse(
      Cookies.get(AUTH_TOKEN_KEY) ?? 'null'
    ) as TokensInfo;
    if (tokens?.token) {
      await fetchBase(
        `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/auth/logout`,
        {
          method: 'POST',
        },
        {
          token: tokens.token,
          refresh_token: tokens.refresh_token,
          chat_token: tokens.chat_token,
          expires_at: tokens.expires_at,
          setTokensInfo,
        }
      );
    }
    setTokensInfo(null);
    removeQueries();
    localStorage.clear();
  }, [setTokensInfo, fetchBase]);

  const loadData = useCallback(async () => {
    const tokens = JSON.parse(
      Cookies.get(AUTH_TOKEN_KEY) ?? 'null'
    ) as TokensInfo;

    setTokensInfoRef(tokens);

    try {
      if (tokens?.token) {
        const response = await fetchBase(
          `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/auth/me`,
          {
            method: 'GET',
          },
          {
            token: tokens.token,
            refresh_token: tokens.refresh_token,
            chat_token: tokens.chat_token,
            expires_at: tokens.expires_at,
            setTokensInfo,
          }
        );

        if (response.status === HTTP_CODES_ENUM.UNAUTHORIZED) {
          logOut();
          return;
        }

        const data = await response.json();
        setUser(data);
      }
    } catch {
      logOut();
    } finally {
      setIsLoaded(true);
    }
  }, [fetchBase, logOut, setTokensInfoRef, setTokensInfo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const onMessage = (
      event: MessageEvent<{
        tabId: string;
        tokens: TokensInfo;
      }>
    ) => {
      if (event.data.tabId === tabId) return;

      if (!event.data.tokens) setUser(null);
      setTokensInfoRef(event.data.tokens);
    };

    broadcastChannel.addEventListener('message', onMessage);

    return () => {
      broadcastChannel.removeEventListener('message', onMessage);
    };
  }, [broadcastChannel, setTokensInfoRef, tabId]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      user,
    }),
    [isLoaded, user]
  );

  const contextActionsValue = useMemo(
    () => ({
      setUser,
      logOut,
    }),
    [logOut]
  );

  const contextTokensValue = useMemo(
    () => ({
      tokensInfoRef,
      setTokensInfo,
    }),
    [setTokensInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthActionsContext.Provider value={contextActionsValue}>
        <AuthTokensContext.Provider value={contextTokensValue}>
          {props.children}
        </AuthTokensContext.Provider>
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
