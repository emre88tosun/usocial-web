import React from 'react';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import useInfiniteInfluencers from '@hooks/influencer/useInfiniteInfluencers';
import { Spinner } from '@nextui-org/react';
import InfluencerCard from '@components/molecules/InfluencerCard';
export default function Discover() {
  const {
    influencers,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
  } = useInfiniteInfluencers();

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage && !isFetchingNextPage && !isFetching,
    onLoadMore: fetchNextPage,
    distance: 300,
  });

  return (
    <section
      ref={scrollerRef}
      className="mx-auto flex max-h-[calc(100vh-90px)] min-h-[calc(100vh-90px)] w-full flex-col gap-4 overflow-auto p-4 sm:max-w-md"
    >
      {influencers.map((influencer) => (
        <InfluencerCard influencer={influencer} key={influencer.id} />
      ))}
      {isLoading && (
        <div className="flex w-full justify-center">
          <Spinner ref={loaderRef} color="primary" size="sm" />
        </div>
      )}
      {hasNextPage && !isFetchingNextPage && !isFetching ? (
        <div className="flex w-full justify-center">
          <Spinner ref={loaderRef} color="primary" size="sm" />
        </div>
      ) : null}
    </section>
  );
}
