'use client';

import { Roles } from '@shared/interfaces';
import AppLayout from '@web/components/AppLayout';
import { LoadingWrapper } from '@web/components/LoadingWrapper';
import WithAuth from '@web/components/WithAuth';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useParams } from 'next/navigation';
import { EventNavigation } from './EventNavigation';

const EventViewPage = () => {
  const { trpc } = useTrpc();
  const { id } = useParams();

  const eventPayload = trpc.eventRouter.findById.useQuery({
    id: String(id),
  });

  return (
    <AppLayout>
      <LoadingWrapper payload={eventPayload}>
        <EventNavigation event={eventPayload.data} />
        <ItemView event={eventPayload.data} />
      </LoadingWrapper>
    </AppLayout>
  );
};

export default WithAuth(EventViewPage, [Roles.User, Roles.Admin]);
