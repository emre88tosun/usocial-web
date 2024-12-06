import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFetch from '@hooks/common/useFetch';
import wrapperFetchJsonResponse from '@helpers/wrapperFetchJsonResponse';
import { BuyGemsBody } from '@customTypes/gem';
import { useCallback } from 'react';

export default function useGemsActions() {
  const fetch = useFetch();
  const queryClient = useQueryClient();
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['me'] }).catch(() => {});
  }, []);
  const purchase = useMutation({
    mutationKey: ['purchase'],
    mutationFn: (data: BuyGemsBody) => {
      return fetch(
        `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/purchase-gems`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ).then(wrapperFetchJsonResponse<{ readonly message: string }>);
    },
    onSuccess: () => {
      invalidateQueries();
    },
  });

  return {
    purchase,
  };
}
