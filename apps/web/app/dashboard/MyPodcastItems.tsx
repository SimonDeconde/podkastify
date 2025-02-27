'use client';

import { LinkIcon } from '@heroicons/react/24/outline';
import { timeAgo } from '@shared/utils';
import { PodcastEntryStatusBadge } from '@web/components/Badge';
import { LoadingSpinner } from '@web/components/LoadingSpinner';
import { PodcastItemDeleteButton } from '@web/components/PodcastItemDeleteButton';
import { useTrpc } from '@web/contexts/TrpcContext';
import Link from 'next/link';

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
      <h2 className="mb-2 text-2xl">Your podcast items</h2>

      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Added
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {myItems.records.length > 0 && (
              <>
                {myItems.records.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      <span>{item.title}</span>
                      <Link
                        color="foreground"
                        href={item.importUrl ?? 'PROBLEM!!'}
                        key={item.id}
                        title="Source URL"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Link>
                    </th>
                    <td className="px-6 py-4">
                      {<PodcastEntryStatusBadge status={item.status} />}
                    </td>
                    <td className="px-6 py-4">
                      {item.createdAt ? timeAgo(item.createdAt) : '--'}
                    </td>
                    <td className="px-6 py-4">
                      <PodcastItemDeleteButton
                        podcastItem={item}
                        onUpdate={() => myItemsPayload.refetch()}
                      />
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      {/*
      <ul className="flex flex-col gap-2">
        {myItems.records.length > 0 && (
          <>
            {myItems.records.map((item) => (
              <PodcastItemCard key={item.id} item={item} />
            ))}
          </>
        )}
      </ul> */}
    </>
  );
}
