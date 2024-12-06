import { useMemo } from 'react';
import useInfiniteInfluencersQuery from '@queries/influencer/useInfiniteInfluencers';
import { Influencer } from '@customTypes/influencer';

export default function useInfiniteInfluencers() {
  const { data, ...rest } = useInfiniteInfluencersQuery();
  const influencers = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.pages.reduce(
      (prev, next) => {
        if (next.status === 200) {
          return [...prev, ...next.data.data];
        }
        return prev;
      },
      [] as Array<Influencer & { chat_unlocked: boolean }>
    );
  }, [data]);
  return {
    data,
    influencers,
    ...rest,
  };
}
