import { LinkIcon } from '@heroicons/react/24/outline';
import { PodcastEntryDto } from '@server/podcast-entry/entities/podcast-entry.entity';
import { timeAgo } from '@shared/utils';
import Link from 'next/link';
import { PodcastEntryStatusBadge } from './Badge';
import { PodcastItemActionStatus } from './PodcastItemDeleteButton';

type Props = {
  item: PodcastEntryDto;
};

export const PodcastItemTableRow = ({ item }: Props) => {
  return (

  );
};
