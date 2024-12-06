import React, { createContext } from 'react';
import { Tokens } from '@customTypes/tokens';
import { User } from '@customTypes/user';

export type TokensInfo = Tokens | null;

export const AuthContext = createContext<{
  user: User | null;
  isLoaded: boolean;
}>({
  user: null,
  isLoaded: true,
});

export const AuthActionsContext = createContext<{
  setUser: (_user: User) => void;
  logOut: () => void;
}>({
  setUser: () => {},
  logOut: () => {},
});

export const AuthTokensContext = createContext<{
  tokensInfoRef: React.MutableRefObject<Tokens>;
  setTokensInfo: (_tokensInfo: TokensInfo) => void;
}>({
  tokensInfoRef: {
    current: {
      token: null,
      refresh_token: null,
      chat_token: null,
      expires_at: null,
    },
  },
  setTokensInfo: () => {},
});
