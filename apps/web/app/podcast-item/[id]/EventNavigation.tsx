'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import { EventDto } from '@server/event/entities/event.entity';
import { RoutePath } from '@shared/route-path';
import { replaceAll } from '@shared/utils';
import { Breadcrumb } from '@web/components/Breadcrumb';

type Props = {
  event?: EventDto;
};

export const EventNavigation = ({ event }: Props) => {
  if (!event) {
    // No op.
    return null;
  }

  const elements = [
    { label: 'Dashboard', href: RoutePath.DASHBOARD, icon: <HomeIcon /> },
    {
      label: event.communityName,
      href: RoutePath.COMMUNITY.replace('[ticker]', event.communityTicker),
    },
    {
      label: event.name,
      href: replaceAll(RoutePath.EVENT, {
        '[id]': event.id,
      }),
    },
  ];

  return (
    <div className="my-4">
      <Breadcrumb elements={elements} />
    </div>
  );
};
