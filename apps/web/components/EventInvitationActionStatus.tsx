import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/button';
import { InvitationStatus } from '@prisma/client';
import { EventDto } from '@server/event/entities/event.entity';
import { InvitationDto } from '@server/invitation/entities/invitation.entity';
import { useTrpc } from '@web/contexts/TrpcContext';
import { isFuture } from 'date-fns';
import React from 'react';

type Props = {
  invitation?: InvitationDto;
  event?: EventDto;
  onUpdate?: () => void;
  allowChangeStatus?: boolean;
};

export const EventInvitationActionStatus = ({
  invitation,
  event,
  onUpdate,
  allowChangeStatus = false,
}: Props) => {
  const { trpc } = useTrpc();

  const updateInvitationStatus =
    trpc.invitationRouter.updateStatus.useMutation();

  const updateInvitationCallback = async (
    invitationId: string,
    status: InvitationStatus,
  ) => {
    await updateInvitationStatus.mutateAsync({
      id: invitationId,
      status,
    });

    if (onUpdate) {
      onUpdate();
    }
  };

  const buttons: React.ReactNode[] = [];

  const getActionButtons = () => {
    return [
      <Button
        color="primary"
        key="accept"
        onClick={() =>
          invitation &&
          updateInvitationCallback(invitation?.id, InvitationStatus.accepted)
        }
      >
        Accept
      </Button>,
      <Button
        color="danger"
        variant="flat"
        key="reject"
        onClick={() =>
          invitation &&
          updateInvitationCallback(invitation?.id, InvitationStatus.rejected)
        }
      >
        Decline
      </Button>,
    ];
  };

  if (invitation) {
    switch (invitation.status) {
      case InvitationStatus.pending:
        if (event && isFuture(event.toDt)) {
          buttons.push(...getActionButtons());
        } else {
          buttons.push(<ArchiveBoxIcon className="h-6 w-6" />, 'Event is over');
        }
        break;
      case InvitationStatus.accepted:
        buttons.push(<CheckCircleIcon className="h-6 w-6" />, 'Going!');
        break;
      case InvitationStatus.rejected:
        buttons.push(<XCircleIcon className="h-6 w-6" />, 'Not going!');
        break;
      case InvitationStatus.voided:
        buttons.push(
          <ArchiveBoxIcon className="h-6 w-6" />,
          'Invitation expired',
        );
        break;
    }
  } else {
    buttons.push(<>No invitation found</>);
  }

  // For admin-only for now.
  if (
    allowChangeStatus &&
    invitation &&
    invitation?.status !== InvitationStatus.pending
  ) {
    buttons.push(getActionButtons());
  }

  return (
    <div className="flex gap-2">
      {buttons.map((button, index) => (
        <div key={index}>{button}</div>
      ))}
    </div>
  );
};
