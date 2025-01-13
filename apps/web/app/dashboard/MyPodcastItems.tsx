'use client';

import { LoadingSpinner } from '@web/components/LoadingSpinner';
import { PodcastItemCard } from '@web/components/PodcastItemCard';
import { useTrpc } from '@web/contexts/TrpcContext';

export default function MyPodcastItems() {
  const { trpc } = useTrpc();

  const myItemsPayload =
    trpc.podcastEntryRouter.findMyPodcastEntries.useQuery();

  if (!myItemsPayload.data) {
    return <LoadingSpinner />;
  }

  const myItems = myItemsPayload.data;

  return (
    <>
      <h2 className="mb-2 text-xl">Your Items</h2>
      <ul className="flex flex-col gap-2">
        {myItems.records.length > 0 && (
          <>
            {myItems.records.map((item) => (
              <PodcastItemCard key={item.id} item={item} />
            ))}
          </>
        )}
      </ul>
    </>
  );
}
