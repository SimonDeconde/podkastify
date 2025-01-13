import { Chip, ChipProps } from '@nextui-org/chip';
import { Tooltip } from '@nextui-org/tooltip';
import { EventStatus, InvitationStatus } from '@prisma/client';
import { EventDto } from '@server/event/entities/event.entity';
import { InvitationDto } from '@server/invitation/entities/invitation.entity';

type InviteStatusBadgeProps = {
  status: InvitationDto['status'];
};
type EventStatusBadgeProps = {
  status: EventDto['status'];
};

export const InviteStatusBadge = (props: InviteStatusBadgeProps) => {
  let color: ChipProps['color'] = undefined;
  let text = '';

  switch (props.status) {
    case InvitationStatus.accepted:
      color = 'success';
      text = 'going';
      break;
    case InvitationStatus.pending:
      color = 'warning';
      text = 'pending';
      break;
    case InvitationStatus.rejected:
      color = 'danger';
      text = "can't make it";
      break;
    case 'voided':
      color = 'default';
      text = 'voided';
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

export const EventStatusBadge = (props: EventStatusBadgeProps) => {
  let color: ChipProps['color'] = undefined;

  let title = '';
  let text = '';

  switch (props.status) {
    case EventStatus.confirmed:
      color = 'success';
      title = 'The minimum number of attendees has been met.';
      text = 'Confirmed';
      break;
    case EventStatus.pending:
      color = 'warning';
      title = 'The minimum number of attendees has not been met.';
      text = 'Not confirmed yet';
      break;
    case EventStatus.cancelled:
      color = 'danger';
      title = 'This dinner was cancelled.';
      text = 'Cancelled';
      break;
    case 'draft':
    default:
      color = 'default';
      title = "Hum, don't know this status!";
      text = 'Unknown status...';
  }

  return (
    <Tooltip content={title} color="secondary" size="sm">
      <Chip color={color} title={title} size="sm" variant="faded">
        {text}
      </Chip>
    </Tooltip>
  );
};

// export const EventStatusPill = (props: EventStatusBadgeProps) => {
//   let title = '';
//   let color = '';
//   switch (props.text) {
//     case 'confirmed':
//       color = 'bg-green-600';
//       title = 'The event is confirmed as the number of attendees has been met.';
//       break;
//     case 'pending':
//       color = 'bg-orange-400';
//       title =
//         'The event is not confirmed yet, since the minimum number of guests has not been reached.';
//       break;
//     case 'rejected':
//       color = 'bg-red-600';
//       break;
//     case 'draft':
//     default:
//       color = 'default';
//   }

//   return (
//     <span
//       className="flex items-center text-sm font-medium text-gray-900 dark:text-white"
//       title={title}
//     >
//       <span
//         className={`me-1.5 flex h-2.5 w-2.5 flex-shrink-0 rounded-full ${color}`}
//       ></span>
//     </span>
//   );
// };
