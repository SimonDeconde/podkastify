'use client';

import { useUserContext } from '@web/app/user/UserContext';
import { EventCard } from '@web/components/EventCard';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useParams } from 'next/navigation';

export default function InvitationView() {
  const { trpc } = useTrpc();
  const { params } = useParams();
  const { currentUser } = useUserContext();

  const id = params[0];

  const invitationPayload = trpc.invitationRouter.findById.useQuery({
    id: String(id),
  });
  const eventPayload = trpc.eventRouter.findById.useQuery({
    id: String(invitationPayload.data?.eventId),
  });

  if (invitationPayload.isLoading || eventPayload.isLoading) {
    return 'Loading...';
  }

  if (!invitationPayload.data || !eventPayload.data) {
    return 'Something went wrong... No data found.';
  }

  const invitation = invitationPayload.data;
  const event = eventPayload.data;

  return (
    <div>
      <h1 className="my-8 text-4xl">
        {currentUser?.id === invitation.userId
          ? 'You are invited to'
          : `${invitation.userFirstName} is invited to`}
        :
      </h1>
      <EventCard
        event={event}
        selectedInvitation={invitation}
        emphasizeEventActionButtons={false}
      />
    </div>
  );
}
