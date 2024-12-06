import { useInfiniteQuery } from '@tanstack/react-query';
import useFetch from '@hooks/common/useFetch';
import wrapperFetchJsonResponse from '@helpers/wrapperFetchJsonResponse';
import HTTP_CODES_ENUM from '@constants/http';
import type { Influencer } from '@customTypes/influencer';
import { InfinityPaginationType } from '@customTypes/misc';

export type InfiniteCompaniesResponse = InfinityPaginationType<
  Influencer & { chat_unlocked: boolean }
>;

export default function useInfiniteCompanies() {
  const fetch = useFetch();
  const requestUrl = new URL(
    `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/influencers`
  );
  requestUrl.searchParams.append('per_page', '3');

  return useInfiniteQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['influencers', 'infinite-influencers', requestUrl.toString()],
    queryFn: ({ pageParam }) => {
      if (!requestUrl.searchParams.has('page')) {
        requestUrl.searchParams.append('page', pageParam.toString());
      } else {
        requestUrl.searchParams.set('page', pageParam.toString());
      }
      return fetch(requestUrl, {
        method: 'GET',
      }).then(wrapperFetchJsonResponse<InfiniteCompaniesResponse>);
    },
    getNextPageParam: (last) => {
      if (last.status === HTTP_CODES_ENUM.OK) {
        if (last.data.last_page > last.data.current_page) {
          return last.data.current_page + 1;
        }
      }
      return null;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 60,
  });
}
