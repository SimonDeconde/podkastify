import { Chip, ChipProps } from '@heroui/react';
import { PodcastEntryStatus } from '@prisma/client';

type Props = {
  status: PodcastEntryStatus;
};

export const PodcastEntryStatusBadge = (props: Props) => {
  let color: ChipProps['color'] = undefined;
  let text = '';

  switch (props.status) {
    case PodcastEntryStatus.pending:
      color = 'warning';
      text = 'pending';
      break;
    case PodcastEntryStatus.processing:
      color = 'warning';
      text = 'processing';
      break;
    case PodcastEntryStatus.ready:
      color = 'success';
      text = 'ready';
      break;
    case PodcastEntryStatus.error:
      color = 'danger';
      text = 'error';
      break;
    default:
      color = 'default';
      text = 'Unknown status...';
  }

  return (
    <Chip
      className="gap-1 border-none capitalize text-default-600"
      color={color}
      size="sm"
      variant="dot"
    >
      {text}
    </Chip>
  );
};
