'use client';

import { InformationCircleIcon, LinkIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react';
import { timeAgo } from '@shared/utils';
import { PodcastEntryStatusBadge } from '@web/components/Badge';
import { LoadingSpinner } from '@web/components/LoadingSpinner';
import { PodcastItemActionIcons } from '@web/components/PodcastItemActionIcons';
import { useTrpc } from '@web/contexts/TrpcContext';
import { ceil } from 'lodash';
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
        <Table selectionMode="single">
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn className="text-center">Status</TableColumn>
            <TableColumn className="text-center">Added</TableColumn>
            <TableColumn className="text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No rows to display.'}>
            {myItems.records.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span>{item.title}</span>
                  <div className="mt-1 flex items-center gap-1">
                    <Link
                      color="foreground"
                      href={item.importUrl ?? 'PROBLEM!!'}
                      key={item.id}
                      title="Source URL"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Link>

                    <Tooltip
                      content={`Processing time ${item.processingTimeMs && ceil(item.processingTimeMs / 1000)} sec`}
                    >
                      <InformationCircleIcon className="h-4 w-4" />
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  {<PodcastEntryStatusBadge status={item.status} />}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  {item.createdAt ? timeAgo(item.createdAt) : '--'}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <PodcastItemActionIcons
                    podcastItem={item}
                    onUpdate={() => myItemsPayload.refetch()}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
