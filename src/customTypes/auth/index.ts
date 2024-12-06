import { Tokens } from '@customTypes/tokens';
import { User } from '@customTypes/user';

export type AuthLoginRequest = {
  email: string;
  password: string;
};
export type AuthRegisterRequest = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
};

export type AuthLoginResponse = Tokens & {
  user: User;
};

export type AuthRegisterResponse = {
  message: string;
};
