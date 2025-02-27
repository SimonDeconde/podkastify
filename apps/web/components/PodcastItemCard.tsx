import { LinkIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader } from '@nextui-org/card';
import { PodcastEntryDto } from '@server/podcast-entry/entities/podcast-entry.entity';
import { formatDate, timeAgo } from '@shared/utils';
import Link from 'next/link';
import { PodcastEntryStatusBadge } from './Badge';

type Props = {
  item: PodcastEntryDto;
};

export const PodcastItemCard = ({ item }: Props) => {
  return (
    <Card>
      <CardHeader className="justify-between">
        <div className="flex flex-col gap-5">
          <h4 className="text-xl">{item.title}</h4>
          <div className="flex gap-2">
            <Link
              color="foreground"
              href={item.importUrl ?? 'PROBLEM!!'}
              className="flex items-center gap-1"
              key={item.id}
            >
              Source <LinkIcon className="h-4 w-4" />
            </Link>
            <span>·</span>
            Published: {item.pubDate ? formatDate(item.pubDate) : '--'}
            <span>·</span>
            Added: {item.createdAt ? timeAgo(item.createdAt) : '--'}
            <span>·</span>
            Status: {<PodcastEntryStatusBadge status={item.status} />}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
