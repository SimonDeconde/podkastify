import { EventDto } from '@server/event/entities/event.entity';
import { RoutePath } from '@shared/route-path';
import Link from 'next/link';

type Props = {
  event: EventDto;
};

export const EventManageButton = ({ event }: Props) => {
  return (
    <Link
      key="edit"
      href={RoutePath.EVENT.replace('[id]', event.id)}
      className="shadow-xs rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-500 hover:bg-gray-50"
    >
      Manage event
    </Link>
  );
};
