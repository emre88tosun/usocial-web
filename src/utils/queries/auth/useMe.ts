import { useQuery } from '@tanstack/react-query';
import useFetch from '@hooks/common/useFetch';
import wrapperFetchJsonResponse from '@helpers/wrapperFetchJsonResponse';
import HTTP_CODES_ENUM from '@constants/http';
import type { User } from '@customTypes/user';

export default function useMe() {
  const fetch = useFetch();
  const requestUrl = new URL(
    `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/auth/me`
  );

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['me'],
    queryFn: () =>
      fetch(requestUrl, {
        method: 'GET',
      })
        .then(wrapperFetchJsonResponse<User>)
        .then((result) => {
          if (result.status === HTTP_CODES_ENUM.OK) {
            return result.data;
          }
          if (result.status === HTTP_CODES_ENUM.NOT_FOUND) {
            throw new Error(result.data.error);
          }
          return null;
        }),
    staleTime: 1000 * 60 * 30,
  });
}
