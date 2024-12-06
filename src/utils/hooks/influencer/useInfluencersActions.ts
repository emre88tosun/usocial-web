import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFetch from '@hooks/common/useFetch';
import wrapperFetchJsonResponse from '@helpers/wrapperFetchJsonResponse';
import { BecomeInfluencerBody } from '@customTypes/influencer';
import { useCallback } from 'react';

export default function useInfluencersActions() {
  const fetch = useFetch();
  const queryClient = useQueryClient();
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['me'] }).catch(() => {});
  }, []);
  const invalidateInfluencers = useCallback(() => {
    queryClient
      .invalidateQueries({ queryKey: ['influencers'] })
      .catch(() => {});
  }, []);
  const become = useMutation({
    mutationKey: ['become-influencer'],
    mutationFn: (data: BecomeInfluencerBody) => {
      return fetch(
        `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/influencers/become`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ).then(
        wrapperFetchJsonResponse<{ bio: string; gem_cost_per_dm: number }>
      );
    },
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const unlock = useMutation({
    mutationKey: ['unlock-influencer'],
    mutationFn: (data: { influencer_id: number }) => {
      return fetch(
        `${import.meta.env.VITE_REACT_APP_REST_API_BASE}/chat/unlock`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ).then(wrapperFetchJsonResponse<{ message: string }>);
    },
    onSuccess: () => {
      invalidateInfluencers();
      invalidateQueries();
    },
  });

  return {
    become,
    unlock,
  };
}
