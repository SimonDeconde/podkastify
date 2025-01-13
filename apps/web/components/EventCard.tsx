import { Card, CardBody } from '@nextui-org/card';
import { InvitationStatus } from '@prisma/client';
import { EventDto } from '@server/event/entities/event.entity';
import { InvitationDto } from '@server/invitation/entities/invitation.entity';
import { RoutePath } from '@shared/route-path';
import { formatDateTimeSpan } from '@shared/utils';
import { useUserContext } from '@web/app/user/UserContext';
import { useTrpc } from '@web/contexts/TrpcContext';
import clsx from 'clsx';
import Link from 'next/link';
import { EventStatusBadge } from './Badge';
import { EventInvitationActionStatus } from './EventInvitationActionStatus';
import { EventManageButton } from './EventManageButton';
import { InvitationAvatarGroup } from './InvitationAvatarGroup';
import { LoadingSpinner } from './LoadingSpinner';
import { UserProfile } from './UserProfile';

type Props = {
  event: EventDto;
  selectedInvitation?: InvitationDto;
  emphasizeEventActionButtons?: boolean;
};

export const EventCard = ({
  event,
  selectedInvitation,
  emphasizeEventActionButtons = true,
}: Props) => {
  const { trpc } = useTrpc();
  const { currentUser } = useUserContext();

  const invitationsPayload = trpc.invitationRouter.findByEvent.useQuery({
    id: event.id,
  });
  const hostPayload = trpc.userRouter.findById.useQuery({
    id: event.hostUserId,
  });

  if (!invitationsPayload.data || !hostPayload.data) {
    return <LoadingSpinner />;
  }

  const host = hostPayload.data;
  const invitationList = invitationsPayload.data;

  // If a selectedInvitation is provided, we search in the list of invitations, to ensure
  // that the component will update when the invitation list is refetched. Eg when the
  // accept/reject buttons are clicked.
  const currentInvitation = selectedInvitation
    ? invitationList.find((invite) => invite.id === selectedInvitation.id)
    : invitationList.find((invite) => invite.userId === currentUser?.id);

  const eventDeprioritized =
    currentInvitation?.status === InvitationStatus.rejected ||
    currentInvitation?.status === InvitationStatus.voided;

  const acceptedInvitations = invitationList.filter(
    (invite) => invite.status === InvitationStatus.accepted,
  );

  return (
    <Card
      className={clsx({
        'opacity-50': eventDeprioritized,
      })}
    >
      <CardBody>
        <p>{formatDateTimeSpan(event.fromDt, event.toDt)}</p>
        <Link
          href={RoutePath.EVENT.replace('[id]', event.id)}
          className="my-2 flex flex-col items-center gap-2 text-xl sm:flex-row"
        >
          <h5>{event.name}</h5>
          <EventStatusBadge status={event.status} />
        </Link>

        <div className="mb-3 flex gap-1 font-normal dark:text-gray-400">
          Hosted by{' '}
          <UserProfile
            userId={event.hostUserId}
            fullName={`${host.firstName} ${host.lastName}`}
            profilePicUrl={host.profilePicUrl ?? undefined}
            showProfilePic={false}
          />
        </div>

        <div className="flex flex-col justify-between md:flex-row">
          <div>
            <InvitationAvatarGroup invitations={acceptedInvitations} />
          </div>
          <div className="mt-2">
            {event.hostUserId === currentUser?.id &&
            emphasizeEventActionButtons ? (
              <EventManageButton event={event} />
            ) : (
              <EventInvitationActionStatus
                invitation={currentInvitation}
                event={event}
                onUpdate={() => invitationsPayload.refetch()}
              />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
