import { Progress } from '@nextui-org/progress';
import { EventDto } from '@server/event/entities/event.entity';
import { EventGetInvitationStatsOutputDtoType } from '@server/event/event.dto';

type Props = {
  stats: EventGetInvitationStatsOutputDtoType;
  event: EventDto;
};

export const GuestInvitationStats = ({ stats, event }: Props) => {
  const maxGuests = event.maxGuests || 0;

  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <div className="font-medium">{stats.accepted} confirmed guest(s)</div>
        <div className="font-medium">cap {maxGuests}</div>
      </div>

      <Progress
        value={stats.accepted}
        maxValue={maxGuests}
        size="sm"
        color={event.minGuests > stats.accepted ? 'warning' : 'success'}
        classNames={{
          base: 'max-w-md',
          track: 'drop-shadow-md border border-default',
          indicator: '',
          label: 'tracking-wider font-medium text-default-600',
          value: 'text-foreground/60',
        }}
        showValueLabel={false}
        className="max-w-md"
      />

      <Progress
        label="% of community invited"
        size="sm"
        value={stats.possible - stats.remaining}
        maxValue={stats.possible}
        classNames={{
          base: 'max-w-md mt-3',
          track: 'drop-shadow-md border border-default',
          indicator: 'bg-gradient-to-r from-pink-500 to-yellow-500',
          label: 'tracking-wider font-medium text-default-600',
          value: 'text-foreground/60',
        }}
        showValueLabel={true}
      />
    </>
  );
};
