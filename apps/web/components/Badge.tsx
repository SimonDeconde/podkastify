import { Chip, ChipProps } from '@nextui-org/chip';
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
    <Chip color={color} size="sm" variant="faded">
      {text}
    </Chip>
  );
};
