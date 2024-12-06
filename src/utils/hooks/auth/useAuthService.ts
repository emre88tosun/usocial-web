import { useMutation } from '@tanstack/react-query';
import useFetch from '@hooks/common/useFetch';
import wrapperFetchJsonResponse from '@helpers/wrapperFetchJsonResponse';
import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
} from '@customTypes/auth';

export default function useAuthService() {
  const fetch = useFetch();
  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: AuthLoginRequest) => {
      return fetch(
        `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ).then(wrapperFetchJsonResponse<AuthLoginResponse>);
    },
  });
  const register = useMutation({
    mutationKey: ['register'],
    mutationFn: (data: AuthRegisterRequest) => {
      return fetch(
        `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/auth/register`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ).then(wrapperFetchJsonResponse<AuthRegisterResponse>);
    },
  });

  return {
    login,
    register,
  };
}
