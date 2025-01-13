import { InvitationDto } from '@server/invitation/entities/invitation.entity';
import { PREFERRED_INVITATION_STATUS_ORDER } from '@shared/general';
import _ from 'lodash';
import { GuestInvitationCard } from './GuestInvitationCard';

type Props = {
  invitations: InvitationDto[];
};

export const GuestInvitationList = ({ invitations }: Props) => {
  // Sort invitations
  const invitationsByStatus = _.groupBy(invitations, 'status');

  if (invitations.length === 0) {
    return <p>No invitations yet</p>;
  }

  return (
    <>
      {PREFERRED_INVITATION_STATUS_ORDER.map((status) => {
        const invites = invitationsByStatus[status] || [];
        return (
          <div key={status}>
            {/* <h2 className="mt-5 text-lg text-gray-900">
              {_.upperFirst(status)}
            </h2> */}
            <div className="mt-2">
              {invites.map((invitation) => (
                <GuestInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
