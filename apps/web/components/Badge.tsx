import { Chip, ChipProps } from '@nextui-org/chip';
import { PodcastEntry, PodcastEntryStatus } from '@prisma/client';

export const PodcastEntryStatusBadge = (props: PodcastEntry) => {
  let color: ChipProps['color'] = undefined;
  let text = '';

  switch (props.status) {
    case PodcastEntryStatus.pending:
      color = 'success';
      text = 'going';
      break;
    case PodcastEntryStatus.processing:
      color = 'warning';
      text = 'pending';
      break;
    case PodcastEntryStatus.error:
      color = 'danger';
      text = "can't make it";
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
